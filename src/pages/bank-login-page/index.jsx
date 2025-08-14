import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Logo from '../../components/ui/Logo';
import Icon from '../../components/AppIcon';
import { loginBankUser } from '../../utils/firebaseAuth';
import { useAuth } from '../../contexts/AuthContext';

const BankLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isAuthenticated && currentUser?.role === 'bank') {
      const from = location.state?.from?.pathname || '/bank-dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, location]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await loginBankUser(data.email, data.password);
      if (result.success) {
        const from = location.state?.from?.pathname || '/bank-dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bank Admin Portal - NoteNetra</title>
        <meta 
          name="description" 
          content="Secure sign-in for banking partners to access the NoteNetra administrative dashboard." 
        />
        <meta name="keywords" content="NoteNetra bank login, admin portal, banking partner, secure login" />
        <link rel="canonical" href="/bank-login" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Logo />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 -mt-16">
          <div className="w-full max-w-md space-y-8">
            <div className="bg-card rounded-xl shadow-interactive border border-border p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Bank Administrative Portal
                </h1>
                <p className="text-muted-foreground">
                  Secure sign-in for banking partners
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-red-500" />
                    <span className="text-sm text-red-500">{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@bank-email.com"
                  required
                  error={errors?.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  error={errors?.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e?.target?.checked)}
                    />
                    <label htmlFor="remember-me" className="text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    to="#" 
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  className="transition-micro hover-lift"
                >
                  Sign In
                </Button>
              </form>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Shield" size={14} />
                    <span>SSL Secure</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Lock" size={14} />
                    <span>Bank-Grade Security</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>For authorized bank personnel only.</p>
              <p>© {new Date()?.getFullYear()} NoteNetra. Empowering MSMEs across India.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BankLoginPage;