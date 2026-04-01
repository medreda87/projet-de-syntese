// Version simulation - Pour tester l'interface
const loginWithGoogle = async () => {
  setLoading(true);
  try {
    // Simuler une connexion Google
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      id: 'google_' + Date.now(),
      name: 'Ahmed Benali',
      email: 'ahmed@gmail.com',
      avatar: 'https://ui-avatars.com/api/?background=6fbf4c&color=fff&name=Ahmed',
      provider: 'google',
      role: 'User'
    };
    
    setUser(userData);
    localStorage.setItem('freshfold_user', JSON.stringify(userData));
    alert('✅ Connexion Google simulée ! (Mode test)');
    return userData;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};

const loginWithFacebook = async () => {
  setLoading(true);
  try {
    // Simuler une connexion Facebook
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      id: 'fb_' + Date.now(),
      name: 'Fatima Zahra',
      email: 'fatima@facebook.com',
      avatar: 'https://ui-avatars.com/api/?background=1877F2&color=fff&name=Fatima',
      provider: 'facebook',
      role: 'User'
    };
    
    setUser(userData);
    localStorage.setItem('freshfold_user', JSON.stringify(userData));
    alert('✅ Connexion Facebook simulée ! (Mode test)');
    return userData;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};