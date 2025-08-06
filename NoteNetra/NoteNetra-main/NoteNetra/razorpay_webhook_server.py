from flask import Flask, request, jsonify
import hmac, hashlib
import firebase_admin
from firebase_admin import credentials, db
import os
from datetime import datetime, timedelta
from collections import defaultdict
import requests

app = Flask(__name__)
WEBHOOK_SECRET = 'chaitanya_sethi'
transactions = []

# Initialize Firebase Admin SDK with error handling
try:
    cred_path = 'serviceAccountKey.json'
    if not os.path.exists(cred_path):
        print(f'ERROR: {cred_path} file not found in project root!')
    cred = credentials.Certificate(cred_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://notenetra-default-rtdb.firebaseio.com'
        })
    print('Firebase Admin SDK initialized successfully.')
except Exception as e:
    print('Firebase Admin SDK initialization error:', e)

@app.route('/webhook', methods=['POST'])
def razorpay_webhook():
    try:
        payload = request.data
        signature = request.headers.get('X-Razorpay-Signature')
        expected_signature = hmac.new(
            WEBHOOK_SECRET.encode(), payload, hashlib.sha256
        ).hexdigest()
        if signature != expected_signature:
            print('Invalid signature')
            return 'Invalid signature', 400

        data = request.json
        if data.get('event') == 'payment.captured':
            payment = data['payload']['payment']['entity']
            name = payment.get('email', 'Razorpay User')
            amount = int(payment['amount']) / 100
            payment_data = {
                'name': name,
                'amount': amount,
                'byQR': True,
                'timestamp': payment.get('created_at'),
                'method': payment.get('method', 'razorpay'),
                'order_id': payment.get('order_id'),
                'payment_id': payment.get('id'),
                'email': payment.get('email'),
                'contact': payment.get('contact'),
            }
            transactions.append(payment_data)
            try:
                ref = db.reference('transactions/razorpay')
                ref.push(payment_data)
                print('Pushed to Firebase:', payment_data)
            except Exception as e:
                print('Firebase push error:', e)
        else:
            print('Event not payment.captured:', data.get('event'))
        return '', 200
    except Exception as e:
        print('Webhook handler error:', e)
        return 'Webhook handler error', 500

@app.route('/transactions')
def get_transactions():
    return jsonify(transactions)

@app.route('/credit_score/<uid>', methods=['GET'])
def credit_score(uid):
    try:
        # Fetch all cash transactions
        esp_ref = db.reference('transactions/esp')
        esp_data = esp_ref.get() or {}
        cash_txs = [tx for tx in esp_data.values() if tx.get('userId') == uid]

        # Fetch all UPI/online transactions
        razorpay_ref = db.reference('transactions/razorpay')
        razorpay_data = razorpay_ref.get() or {}
        upi_txs = [tx for tx in razorpay_data.values() if tx.get('userId') == uid]

        # Helper to parse timestamp (supports both string and epoch)
        def parse_ts(ts):
            if not ts:
                return None
            if isinstance(ts, (int, float)):
                return datetime.fromtimestamp(float(ts))
            for fmt in ("%d-%m-%Y %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):  # try common formats
                try:
                    return datetime.strptime(ts, fmt)
                except Exception:
                    continue
            try:
                return datetime.fromisoformat(ts)
            except Exception:
                pass
            try:
                return datetime.fromtimestamp(float(ts))
            except Exception:
                pass
            return None

        # Get current month/year
        now = datetime.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Calculate monthly volumes
        monthly_upi = 0
        monthly_cash = 0
        daily_activity = defaultdict(int)
        for tx in upi_txs:
            ts = parse_ts(tx.get('timestamp') or tx.get('time'))
            if ts and ts >= month_start:
                monthly_upi += float(tx.get('amount', 0))
                daily_activity[ts.date()] += 1
        for tx in cash_txs:
            ts = parse_ts(tx.get('timestamp') or tx.get('time'))
            if ts and ts >= month_start:
                monthly_cash += float(tx.get('amount', 0))
                daily_activity[ts.date()] += 1

        # Consistency bonus: number of days with at least 1 transaction this month
        days_in_month = (now.replace(month=now.month % 12 + 1, day=1) - timedelta(days=1)).day
        days_with_tx = len([d for d in daily_activity if d >= month_start.date()])
        consistency_bonus = min(days_with_tx, days_in_month) * 2  # 2 points per active day

        # Simple scoring formula (customize as needed)
        score = (
            (monthly_upi * 0.5) +
            (monthly_cash * 0.3) +
            consistency_bonus
        )
        # Optionally, normalize or cap the score
        score = round(score, 2)
        return jsonify({
            'uid': uid,
            'monthly_upi': monthly_upi,
            'monthly_cash': monthly_cash,
            'consistency_days': days_with_tx,
            'consistency_bonus': consistency_bonus,
            'score': score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/apply-loan/<uid>', methods=['POST'])
def apply_loan(uid):
    try:
        # 1. Read user profile
        user_ref = db.reference(f'users/{uid}')
        user_profile = user_ref.get()
        if not user_profile:
            return jsonify({'error': 'User profile not found'}), 404
        name = user_profile.get('fullName') or user_profile.get('firstName', '') + ' ' + user_profile.get('lastName', '')
        pan = user_profile.get('panNumber', '')

        # 2. Get credit score (reuse logic)
        # Use the same logic as /credit_score/<uid>
        esp_ref = db.reference('transactions/esp')
        esp_data = esp_ref.get() or {}
        cash_txs = [tx for tx in esp_data.values() if tx.get('userId') == uid]
        razorpay_ref = db.reference('transactions/razorpay')
        razorpay_data = razorpay_ref.get() or {}
        upi_txs = [tx for tx in razorpay_data.values() if tx.get('userId') == uid]
        def parse_ts(ts):
            if not ts:
                return None
            if isinstance(ts, (int, float)):
                return datetime.fromtimestamp(float(ts))
            for fmt in ("%d-%m-%Y %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
                try:
                    return datetime.strptime(ts, fmt)
                except Exception:
                    continue
            try:
                return datetime.fromisoformat(ts)
            except Exception:
                pass
            try:
                return datetime.fromtimestamp(float(ts))
            except Exception:
                pass
            return None
        now = datetime.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_upi = 0
        monthly_cash = 0
        daily_activity = defaultdict(int)
        for tx in upi_txs:
            ts = parse_ts(tx.get('timestamp') or tx.get('time'))
            if ts and ts >= month_start:
                monthly_upi += float(tx.get('amount', 0))
                daily_activity[ts.date()] += 1
        for tx in cash_txs:
            ts = parse_ts(tx.get('timestamp') or tx.get('time'))
            if ts and ts >= month_start:
                monthly_cash += float(tx.get('amount', 0))
                daily_activity[ts.date()] += 1
        days_in_month = (now.replace(month=now.month % 12 + 1, day=1) - timedelta(days=1)).day
        days_with_tx = len([d for d in daily_activity if d >= month_start.date()])
        consistency_bonus = min(days_with_tx, days_in_month) * 2
        score = (
            (monthly_upi * 0.5) +
            (monthly_cash * 0.3) +
            consistency_bonus
        )
        score = round(score, 2)
        eligibility = int(score * 10)
        monthly_revenue = monthly_upi + monthly_cash

        # 3. Send POST to mock loan provider API
        payload = {
            'name': name.strip(),
            'pan': pan,
            'monthly_revenue': monthly_revenue,
            'score': score,
            'requested_amount': eligibility
        }
        try:
            api_resp = requests.post('https://reqres.in/api/loans', json=payload, timeout=10)
            api_resp.raise_for_status()
            api_result = api_resp.json()
            success = True
            message = 'Loan application submitted successfully.'
        except Exception as e:
            api_result = {'error': str(e)}
            success = False
            message = f'Loan application failed: {e}'

        # 4. Log the request to Firebase
        log_ref = db.reference(f'loans/{uid}/latestApplication')
        log_ref.set({
            'payload': payload,
            'api_result': api_result,
            'success': success,
            'timestamp': datetime.now().isoformat()
        })

        # 5. Return success or failure message
        return jsonify({'success': success, 'message': message, 'api_result': api_result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def log_loan_application(uid, data):
    """
    Logs a loan application to Firebase at /loans/<uid>/latestApplication
    Fields:
        - dateApplied: today's date (YYYY-MM-DD)
        - score: from data['score']
        - requestedAmount: from data['requestedAmount']
        - status: 'pending'
        - provider: 'FlexiLoans'
    """
    from datetime import datetime
    log_ref = db.reference(f'loans/{uid}/latestApplication')
    log_ref.set({
        'dateApplied': datetime.now().strftime('%Y-%m-%d'),
        'score': data.get('score'),
        'requestedAmount': data.get('requestedAmount'),
        'status': 'pending',
        'provider': 'FlexiLoans'
    })

if __name__ == '__main__':
    print('Starting Razorpay webhook server on port 5000...')
    app.run(host='0.0.0.0', port=5000) 