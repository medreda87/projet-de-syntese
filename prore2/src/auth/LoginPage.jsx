import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup, loginWithGoogle, loginWithFacebook } = useAuth();

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Mode connexion
        await login(email, password);
      } else {
        // Mode inscription
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          setLoading(false);
          return;
        }
        await signup(email, password);
      }
    } catch (err) {
      console.error('Erreur:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else {
        setError(err.message || 'Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Google
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Erreur Google:', err);
      setError('Erreur de connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Facebook
  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithFacebook();
    } catch (err) {
      console.error('Erreur Facebook:', err);
      setError('Erreur de connexion avec Facebook');
    } finally {
      setLoading(false);
    }
  };

  // Basculer entre connexion et inscription
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left side - Branding */}
        <div className="login-brand">
          <div className="brand-content">
            <h1 className="fresh-fold-logo">Fresh Fold</h1>
            <p className="brand-quote">
              {isLogin 
                ? 'Connectez-vous à votre compte' 
                : 'Créez votre compte gratuitement'}
              <br />
              simplifiez votre quotidien.
            </p>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-dot"></span>
                <span>Gestion intelligente</span>
              </div>
              <div className="feature">
                <span className="feature-dot"></span>
                <span>Accès sécurisé</span>
              </div>
              <div className="feature">
                <span className="feature-dot"></span>
                <span>Synchronisation cloud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-form-container">
          <div className="form-header">
            <h2>{isLogin ? 'Bienvenue' : 'Inscription'}</h2>
            <p>
              {isLogin 
                ? 'Connectez-vous à votre compte' 
                : 'Créez votre compte pour commencer'}
            </p>
          </div>

          {error && (
            <div className="error-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form-modern">
            <div className="input-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse email"
                required
                disabled={loading}
              />
            </div>

            <div className="input-field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="input-field">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#" className="forgot-password">Mot de passe oublié ?</a>
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            </button>
          </form>

          <div className="divider-modern">
            <span>Ou continuer avec</span>
          </div>

          <div className="social-login">
            <button 
              onClick={handleGoogleLogin} 
              className="social-icon google"
              disabled={loading}
              type="button"
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button 
              onClick={handleFacebookLogin} 
              className="social-icon facebook"
              disabled={loading}
              type="button"
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24c5.74-.92 10.13-5.91 10.13-11.93z" fill="#1877F2"/>
              </svg>
            </button>
          </div>

          <div className="signup-link-modern">
            <p>
              {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <button 
                onClick={toggleMode} 
                className="toggle-mode-btn"
                type="button"
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;