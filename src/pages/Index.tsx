import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AdminUsersPanel from '@/components/AdminUsersPanel';
import UserProfileCard from '@/components/UserProfileCard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '', artist_name: '' });
  const [authLoading, setAuthLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ about_me: '', interests: '', achievements: '', social_instagram: '', social_youtube: '', social_spotify: '', social_vk: '' });
  const AUTH_API = 'https://functions.poehali.dev/ca51393e-6fb5-4308-a0f7-ff6e93d59ff5';
  const FOLLOW_API = 'https://functions.poehali.dev/ba34d9b1-61b5-4abf-9a16-b4e979fbd40b';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('user_role');
    
    if (token && userId) {
      setIsLoggedIn(true);
      setIsAdmin(userRole === 'admin');
      loadCurrentUserProfile(userId);
    }
  }, []);

  const loadCurrentUserProfile = async (userId: string) => {
    setProfileLoading(true);
    try {
      const response = await fetch(`${AUTH_API}?action=profile&user_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        setProfileForm({
          about_me: data.user.about_me || '',
          interests: data.user.interests || '',
          achievements: data.user.achievements || '',
          social_instagram: data.user.social_instagram || '',
          social_youtube: data.user.social_youtube || '',
          social_spotify: data.user.social_spotify || '',
          social_vk: data.user.social_vk || ''
        });
      }
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setProfileLoading(true);
    try {
      const response = await fetch(`${AUTH_API}?action=profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(userId),
          ...profileForm
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Профиль успешно обновлён!');
        await loadCurrentUserProfile(userId);
      } else {
        alert(data.message || 'Ошибка обновления профиля');
      }
    } catch (err) {
      alert('Ошибка подключения к серверу');
      console.error('Update profile error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) {
      alert('Заполните email и пароль');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${AUTH_API}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('username', data.user.username);
        
        setIsLoggedIn(true);
        setIsAdmin(data.user.role === 'admin');
        setIsAuthOpen(false);
        setIsNewUser(false);
        setAuthForm({ email: '', password: '', username: '', artist_name: '' });
        await loadCurrentUserProfile(data.user.id);
      } else {
        alert(data.error || 'Ошибка входа');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!authForm.email || !authForm.password || !authForm.username) {
      alert('Заполните все поля');
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${AUTH_API}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
          username: authForm.username,
          artist_name: authForm.artist_name || authForm.username
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('username', data.user.username);
        
        setIsLoggedIn(true);
        setIsAdmin(data.user.role === 'admin');
        setIsAuthOpen(false);
        setIsNewUser(true);
        setAuthForm({ email: '', password: '', username: '', artist_name: '' });
        await loadCurrentUserProfile(data.user.id);
      } else {
        alert(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Icon name="Music" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">PRO SOUND</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setActiveTab('home')} className="text-sm hover:text-primary transition-colors">Главная</button>
              <button onClick={() => setActiveTab('catalog')} className="text-sm hover:text-primary transition-colors">Каталог</button>
              <button onClick={() => setActiveTab('dashboard')} className="text-sm hover:text-primary transition-colors">Личный кабинет</button>
              {isLoggedIn && (
                <button onClick={() => setActiveTab('profile')} className="text-sm hover:text-primary transition-colors">Профиль</button>
              )}
              <button onClick={() => setActiveTab('analytics')} className="text-sm hover:text-primary transition-colors">Аналитика</button>
              <button onClick={() => setActiveTab('support')} className="text-sm hover:text-primary transition-colors">Поддержка</button>
              {isAdmin && (
                <button onClick={() => setActiveTab('admin')} className="text-sm hover:text-primary transition-colors">Админ</button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}>Войти</Button>
                  <Button size="sm" className="gradient-primary border-0" onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }}>Начать</Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                    <Icon name="User" size={16} className="text-primary" />
                    <span className="text-sm font-medium">{localStorage.getItem('username')}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выход
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-6 py-12">
              <h1 className="text-5xl font-bold leading-tight">
                Дистрибуция музыки нового поколения
              </h1>
              <p className="text-xl text-muted-foreground">
                Размещайте свою музыку на всех крупнейших стриминговых платформах
                и получайте честные выплаты за каждое прослушивание
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="gradient-primary border-0" onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }}>
                  Начать бесплатно
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline">
                  Узнать больше
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'TrendingUp', title: 'Рост прослушиваний', desc: 'Увеличьте аудиторию на 300%', value: '+300%' },
                { icon: 'DollarSign', title: 'Прозрачные выплаты', desc: 'Получайте больше за каждый стрим', value: '100%' },
                { icon: 'Globe', title: 'Глобальное покрытие', desc: '150+ стриминговых платформ', value: '150+' }
              ].map((stat, i) => (
                <Card key={i} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon name={stat.icon} className="text-primary" size={24} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                    <CardDescription className="text-base">{stat.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{stat.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl mb-3">Платформы дистрибуции</CardTitle>
                <CardDescription className="text-base">Ваша музыка на всех крупнейших площадках мира</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'Amazon Music', 'Tidal', 'Яндекс.Музыка', 'VK Музыка'].map((platform) => (
                    <div key={platform} className="bg-card hover:bg-accent transition-colors rounded-lg p-6 flex items-center justify-center border border-border">
                      <span className="font-semibold text-sm">{platform}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-3">
                    <Icon name="Music" className="text-white" size={24} />
                  </div>
                  <CardTitle>Для артистов</CardTitle>
                  <CardDescription>Профессиональная дистрибуция с полным контролем</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Без скрытых комиссий', 'Подробная аналитика', 'Сохранение прав', 'Быстрая модерация'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Icon name="CheckCircle" className="text-primary" size={18} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-3">
                    <Icon name="Users" className="text-white" size={24} />
                  </div>
                  <CardTitle>Для лейблов</CardTitle>
                  <CardDescription>Управление каталогом и артистами в одном месте</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Массовая загрузка', 'Управление релизами', 'Отчётность в реальном времени', 'API интеграция'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Icon name="CheckCircle" className="text-primary" size={18} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Каталог релизов</h1>
                <p className="text-muted-foreground">Откройте для себя новую музыку от артистов платформы</p>
              </div>
              <div className="flex gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Жанр" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все жанры</SelectItem>
                    <SelectItem value="electronic">Электроника</SelectItem>
                    <SelectItem value="pop">Поп</SelectItem>
                    <SelectItem value="rock">Рок</SelectItem>
                    <SelectItem value="hiphop">Хип-хоп</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Поиск релизов..." className="w-[250px]" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity gradient-primary border-0">
                        <Icon name="Play" size={16} className="mr-2" />
                        Слушать
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 truncate">Release Title {i}</h3>
                    <p className="text-sm text-muted-foreground truncate">Artist Name</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">Electronic</Badge>
                      <span className="text-xs text-muted-foreground">2024</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {!isLoggedIn ? (
              <Card className="p-12 text-center">
                <Icon name="Lock" size={64} className="mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-3">Требуется авторизация</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Войдите в свой аккаунт или зарегистрируйтесь для доступа к личному кабинету
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}>Войти</Button>
                  <Button variant="outline" onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }}>Регистрация</Button>
                </div>
              </Card>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
                    <p className="text-muted-foreground">Добро пожаловать, {localStorage.getItem('username')}!</p>
                  </div>
                  <Button className="gradient-primary border-0" onClick={() => window.open('https://t9xrr5es.forms.app/bezymyannaya-forma', '_blank')}>
                    <Icon name="Upload" size={18} className="mr-2" />
                    Добавить релиз
                  </Button>
                </div>

                {isNewUser && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="Sparkles" className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Добро пожаловать в PRO SOUND!</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ваш аккаунт успешно создан. Начните с загрузки вашего первого релиза и настройте профиль артиста.
                          </p>
                          <div className="flex gap-3">
                            <Button size="sm" onClick={() => setActiveTab('profile')}>
                              <Icon name="User" size={16} className="mr-2" />
                              Настроить профиль
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setIsNewUser(false)}>Понятно</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { icon: 'Music', label: 'Релизы', value: '0', color: 'text-blue-500' },
                    { icon: 'TrendingUp', label: 'Прослушивания', value: '0', color: 'text-green-500' },
                    { icon: 'DollarSign', label: 'Доход', value: '$0', color: 'text-yellow-500' },
                    { icon: 'Users', label: 'Слушатели', value: '0', color: 'text-purple-500' }
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Icon name={stat.icon} className={stat.color} size={24} />
                          <Badge variant="secondary">+0%</Badge>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Music" size={20} />
                      Мои релизы
                    </CardTitle>
                    <CardDescription>Управляйте вашими релизами и отслеживайте статистику</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Icon name="Disc" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Пока нет релизов</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Загрузите свой первый релиз, чтобы начать зарабатывать на своей музыке
                      </p>
                      <Button className="gradient-primary border-0" onClick={() => window.open('https://t9xrr5es.forms.app/bezymyannaya-forma', '_blank')}>
                        <Icon name="Upload" size={18} className="mr-2" />
                        Добавить релиз
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-5xl mx-auto">
            {!isLoggedIn ? (
              <Card className="p-12 text-center">
                <Icon name="Lock" size={64} className="mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-3">Требуется авторизация</h2>
                <p className="text-muted-foreground mb-6">
                  Войдите в свой аккаунт для просмотра профиля
                </p>
                <Button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}>Войти</Button>
              </Card>
            ) : (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Профиль артиста</h1>
                  <p className="text-muted-foreground">
                    Управляйте своим профилем и настройками аккаунта
                  </p>
                </div>

                {profileLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-muted-foreground">Загрузка профиля...</p>
                    </div>
                  </div>
                ) : currentUser ? (
                  <div className="max-w-3xl mx-auto">
                    <UserProfileCard 
                      user={currentUser}
                      currentUserId={currentUser.id}
                      showActions={false}
                    />
                    
                    <Card className="mt-6 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="Settings" size={20} className="text-primary" />
                        Редактировать профиль
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>О себе</Label>
                          <Textarea 
                            placeholder="Расскажите о себе..." 
                            value={profileForm.about_me}
                            onChange={(e) => setProfileForm({...profileForm, about_me: e.target.value})}
                            rows={4}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Интересы (через запятую)</Label>
                          <Input 
                            placeholder="Музыка, Продакшн, Звукорежиссура..."
                            value={profileForm.interests}
                            onChange={(e) => setProfileForm({...profileForm, interests: e.target.value})}
                          />
                          <p className="text-xs text-muted-foreground">
                            Например: Хип-хоп, EDM, Продакшн, Микширование
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Достижения (через запятую)</Label>
                          <Textarea 
                            placeholder="Ваши достижения и награды..."
                            value={profileForm.achievements}
                            onChange={(e) => setProfileForm({...profileForm, achievements: e.target.value})}
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground">
                            Например: 1 млн прослушиваний на Spotify, Номинация на премию, Релиз на мажор лейбле
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Instagram</Label>
                            <Input 
                              placeholder="https://instagram.com/..."
                              value={profileForm.social_instagram}
                              onChange={(e) => setProfileForm({...profileForm, social_instagram: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>YouTube</Label>
                            <Input 
                              placeholder="https://youtube.com/..."
                              value={profileForm.social_youtube}
                              onChange={(e) => setProfileForm({...profileForm, social_youtube: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Spotify</Label>
                            <Input 
                              placeholder="https://open.spotify.com/..."
                              value={profileForm.social_spotify}
                              onChange={(e) => setProfileForm({...profileForm, social_spotify: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>VK</Label>
                            <Input 
                              placeholder="https://vk.com/..."
                              value={profileForm.social_vk}
                              onChange={(e) => setProfileForm({...profileForm, social_vk: e.target.value})}
                            />
                          </div>
                        </div>

                        <Button 
                          className="w-full gradient-primary border-0"
                          onClick={handleUpdateProfile}
                          disabled={profileLoading}
                        >
                          {profileLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Сохранение...
                            </>
                          ) : (
                            <>
                              <Icon name="Save" size={18} className="mr-2" />
                              Сохранить изменения
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Не удалось загрузить профиль</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Попробуйте перезагрузить страницу
                    </p>
                    <Button onClick={() => window.location.reload()}>
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Перезагрузить
                    </Button>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Аналитика и статистика</h1>
              <p className="text-muted-foreground">Отслеживайте производительность ваших релизов</p>
            </div>

            {!isLoggedIn ? (
              <Card className="p-12 text-center">
                <Icon name="Lock" size={64} className="mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-3">Требуется авторизация</h2>
                <p className="text-muted-foreground mb-6">
                  Войдите в свой аккаунт для просмотра аналитики
                </p>
                <Button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}>Войти</Button>
              </Card>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: 'Eye', label: 'Просмотры профиля', value: '0', change: '+0%' },
                    { icon: 'Play', label: 'Прослушивания', value: '0', change: '+0%' },
                    { icon: 'Heart', label: 'Лайки', value: '0', change: '+0%' },
                    { icon: 'Share2', label: 'Репосты', value: '0', change: '+0%' }
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Icon name={stat.icon} className="text-primary" size={20} />
                          <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>{stat.change}</Badge>
                        </div>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>География слушателей</CardTitle>
                    <CardDescription>Топ стран по прослушиваниям</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Icon name="Globe" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Пока нет данных о географии слушателей</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Поддержка</h1>
              <p className="text-muted-foreground">Мы здесь, чтобы помочь вам</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'Mail', title: 'Email', desc: 'support@prosound.com', action: 'Написать' },
                { icon: 'MessageCircle', title: 'Чат', desc: 'Онлайн поддержка 24/7', action: 'Открыть' },
                { icon: 'Phone', title: 'Телефон', desc: '+7 (800) 123-45-67', action: 'Позвонить' }
              ].map((contact, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon name={contact.icon} className="text-primary" size={24} />
                    </div>
                    <h3 className="font-semibold mb-2">{contact.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{contact.desc}</p>
                    <Button variant="outline" size="sm" className="w-full">{contact.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { q: 'Как загрузить релиз?', a: 'Перейдите в личный кабинет и нажмите кнопку "Добавить релиз"' },
                  { q: 'Какие форматы поддерживаются?', a: 'WAV, FLAC - для лучшего качества звука' },
                  { q: 'Сколько времени занимает модерация?', a: 'Обычно 24-48 часов' },
                  { q: 'Когда я получу выплаты?', a: 'Выплаты производятся ежемесячно' }
                ].map((faq, i) => (
                  <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="HelpCircle" size={16} className="text-primary" />
                      {faq.q}
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {isAdmin && activeTab === 'admin' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
              <p className="text-muted-foreground">Управление пользователями и системой</p>
            </div>

            <AdminUsersPanel />
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Icon name="Music" className="text-white" size={16} />
                </div>
                <span className="font-bold">PRO SOUND</span>
              </div>
              <p className="text-sm text-muted-foreground">Платформа дистрибуции музыки нового поколения</p>
            </div>
            {[
              { title: 'Продукт', links: ['Возможности', 'Тарифы', 'API'] },
              { title: 'Компания', links: ['О нас', 'Блог', 'Карьера'] },
              { title: 'Поддержка', links: ['FAQ', 'Контакты', 'Статус'] }
            ].map((col, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 PRO SOUND. Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' ? 'Войдите для доступа к личному кабинету' : 'Создайте аккаунт для дистрибуции музыки'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input 
                  id="login-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                />
              </div>
              <Button className="w-full gradient-primary border-0" onClick={handleLogin} disabled={authLoading}>
                {authLoading ? 'Вход...' : 'Войти'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Нет аккаунта? <button className="text-primary hover:underline" onClick={() => setAuthMode('register')}>Зарегистрироваться</button>
              </p>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username (логин)</Label>
                <Input 
                  id="reg-username" 
                  placeholder="username"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-artist-name">Имя артиста (необязательно)</Label>
                <Input 
                  id="reg-artist-name" 
                  placeholder="Ваше сценическое имя"
                  value={authForm.artist_name}
                  onChange={(e) => setAuthForm({...authForm, artist_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль (минимум 6 символов)</Label>
                <Input 
                  id="reg-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                />
              </div>
              <Button className="w-full gradient-primary border-0" onClick={handleRegister} disabled={authLoading}>
                {authLoading ? 'Создание...' : 'Создать аккаунт'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Есть аккаунт? <button className="text-primary hover:underline" onClick={() => setAuthMode('login')}>Войти</button>
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
