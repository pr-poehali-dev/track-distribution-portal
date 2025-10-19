import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AdminUsersPanel from '@/components/AdminUsersPanel';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [releaseStep, setReleaseStep] = useState(1);
  const [authForm, setAuthForm] = useState({ email: '', password: '', username: '', artist_name: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
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
            </div>

            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }}>Войти</Button>
                  <Button size="sm" className="gradient-primary border-0" onClick={() => { setAuthMode('register'); setIsAuthOpen(true); }}>Начать</Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/admin'}>
                        <Icon name="Shield" size={16} className="mr-2" />
                        Админ-панель
                      </Button>
                      <Badge variant="default" className="gradient-primary border-0">
                        <Icon name="Shield" size={14} className="mr-1" />
                        Админ
                      </Badge>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = '/profile'}>
                    <Icon name="User" size={18} className="mr-2" />
                    Профиль
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <Icon name="LogOut" size={18} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <section className="relative py-20 md:py-32 overflow-hidden">
              <div className="absolute inset-0 gradient-primary opacity-10"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                    Дистрибуция треков нового поколения
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Загружайте музыку, распространяйте на всех платформах и получайте роялти
                  </p>
                  <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Button size="lg" className="gradient-primary border-0" onClick={() => setActiveTab('upload')}>
                      <Icon name="Plus" className="mr-2" size={20} />
                      Добавить релиз
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-card/30">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: 'Zap', title: 'Быстрая дистрибуция', desc: 'Ваша музыка на всех платформах за 24 часа' },
                    { icon: 'DollarSign', title: 'Честные роялти', desc: 'Прозрачная система учета и выплат' },
                    { icon: 'BarChart3', title: 'Детальная аналитика', desc: 'Следите за успехом ваших треков' }
                  ].map((item, i) => (
                    <Card key={i} className="gradient-card border-border/50 hover:scale-105 transition-transform">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                          <Icon name={item.icon} className="text-white" size={24} />
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.desc}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="container mx-auto px-4 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Каталог треков</h1>
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <Icon name="Music" size={48} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Каталог пуст</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Здесь будут отображаться все опубликованные релизы после модерации
              </p>
              <Button className="gradient-primary border-0" onClick={() => setActiveTab('upload')}>
                <Icon name="Plus" className="mr-2" size={18} />
                Добавить первый релиз
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="container mx-auto px-4 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Личный кабинет артиста</h1>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Всего прослушиваний</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0' : '1.2M'}</div>
                  <p className="text-sm text-primary mt-1">{isNewUser ? 'Начните загружать' : '+15% за месяц'}</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Заработано роялти</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0₽' : '28,500₽'}</div>
                  <p className="text-sm text-primary mt-1">{isNewUser ? 'Скоро здесь будут выплаты' : '+22% за месяц'}</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Загружено треков</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0' : '18'}</div>
                  <p className="text-sm text-muted-foreground mt-1">{isNewUser ? 'Добавьте первый релиз' : 'На 5 платформах'}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ваши треки</CardTitle>
                <CardDescription>Управляйте своими релизами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(isNewUser ? [] : [
                    { title: 'Summer Vibes', plays: 450000, earnings: 11400, status: 'active', moderation: 'approved' },
                    { title: 'Night Drive', plays: 320000, earnings: 8460, status: 'active', moderation: 'approved' },
                    { title: 'Ocean Waves', plays: 180000, earnings: 4940, status: 'processing', moderation: 'pending' },
                    { title: 'New Track', plays: 0, earnings: 0, status: 'draft', moderation: 'review' }
                  ]).map((track, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Icon name="Music" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {track.status === 'draft' ? 'Черновик' : `${track.plays.toLocaleString()} прослушиваний`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        {track.status !== 'draft' && (
                          <div className="text-right">
                            <p className="font-semibold">{track.earnings}₽</p>
                            <p className="text-sm text-muted-foreground">роялти</p>
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <Badge variant={track.status === 'active' ? 'default' : track.status === 'processing' ? 'secondary' : 'outline'}>
                            {track.status === 'active' ? 'Активен' : track.status === 'processing' ? 'Обработка' : 'Черновик'}
                          </Badge>
                          <Badge variant={track.moderation === 'approved' ? 'default' : track.moderation === 'pending' ? 'secondary' : 'outline'}>
                            {track.moderation === 'approved' && <Icon name="CheckCircle" size={12} className="mr-1" />}
                            {track.moderation === 'pending' && <Icon name="Clock" size={12} className="mr-1" />}
                            {track.moderation === 'review' && <Icon name="AlertCircle" size={12} className="mr-1" />}
                            {track.moderation === 'approved' ? 'Одобрен' : track.moderation === 'pending' ? 'На модерации' : 'Требует правок'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {isLoggedIn && isAdmin && (
              <Card className="mt-8 border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Shield" size={24} className="text-primary" />
                    <Badge variant="default" className="gradient-primary border-0">Админ-панель</Badge>
                  </div>
                  <CardTitle>Панель модератора</CardTitle>
                  <CardDescription>Управление релизами и пользователями</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="moderation" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="moderation">Модерация релизов</TabsTrigger>
                      <TabsTrigger value="users">Специальные</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="moderation" className="mt-6">
                      <div className="space-y-4">
                        {[
                          { artist: 'DJ Example', title: 'New Summer Hit', date: '2025-01-15', status: 'pending' },
                          { artist: 'Artist Two', title: 'Midnight Dreams', date: '2025-01-14', status: 'pending' }
                        ].map((release, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <Icon name="Music" size={32} />
                              </div>
                              <div>
                                <h3 className="font-semibold">{release.title}</h3>
                                <p className="text-sm text-muted-foreground">{release.artist}</p>
                                <p className="text-xs text-muted-foreground mt-1">Отправлен: {release.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button variant="outline" size="sm">
                                <Icon name="Eye" size={16} className="mr-2" />
                                Проверить
                              </Button>
                              <Button variant="outline" size="sm" className="text-primary border-primary/50 hover:bg-primary/10">
                                <Icon name="CheckCircle" size={16} className="mr-2" />
                                Одобрить
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                                <Icon name="XCircle" size={16} className="mr-2" />
                                Отклонить
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="users" className="mt-6">
                      <AdminUsersPanel authApi={AUTH_API} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="container mx-auto px-4 py-12 max-w-3xl animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Загрузка и дистрибуция</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Загрузите ваш трек</CardTitle>
                <CardDescription>Поддерживаемые форматы: WAV, FLAC, MP3 (320kbps)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer bg-slate-600 mx-0 px-[30px]">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Перетащите файл сюда</p>
                  <p className="text-sm text-muted-foreground">или нажмите для выбора</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Название трека</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground" placeholder="Введите название" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Исполнитель</label>
                      <input type="text" className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground" placeholder="Имя артиста" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Жанр</label>
                      <input type="text" className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground" placeholder="Электроника, Поп..." />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Платформы для дистрибуции</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'Tidal', 'SoundCloud'].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full gradient-primary border-0" size="lg" onClick={() => setReleaseDialogOpen(true)}>
                    <Icon name="Send" className="mr-2" size={20} />
                    Продолжить к деталям релиза
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="container mx-auto px-4 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Аналитика и отчеты</h1>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Всего выплат</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0₽' : '117,800₽'}</div>
                  <p className="text-sm text-primary mt-1">{isNewUser ? 'Здесь будет история' : '+18% за месяц'}</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">В ожидании</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0₽' : '30,400₽'}</div>
                  <p className="text-sm text-muted-foreground mt-1">Выплата 15.02.2025</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Прослушиваний</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0' : '2.8M'}</div>
                  <p className="text-sm text-primary mt-1">{isNewUser ? 'Статистика появится' : '+25% за месяц'}</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Активных треков</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isNewUser ? '0' : '18'}</div>
                  <p className="text-sm text-muted-foreground mt-1">На 6 платформах</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>График прослушиваний</CardTitle>
                  <CardDescription>Последние 30 дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[45, 52, 48, 61, 55, 70, 65, 72, 68, 80, 75, 85, 82, 90].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-primary/80 to-primary/40 rounded-t" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                    <span>1 янв</span>
                    <span>15 янв</span>
                    <span>30 янв</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение по платформам</CardTitle>
                  <CardDescription>Доход за текущий месяц</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(isNewUser ? [] : [
                      { platform: 'Spotify', amount: '13,775₽', percent: 45, color: 'bg-primary' },
                      { platform: 'Apple Music', amount: '9,310₽', percent: 31, color: 'bg-secondary' },
                      { platform: 'YouTube Music', amount: '4,940₽', percent: 16, color: 'bg-primary/60' },
                      { platform: 'Deezer', amount: '2,375₽', percent: 8, color: 'bg-primary/40' }
                    ]).map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{item.platform}</span>
                          <span className="text-muted-foreground">{item.amount}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>История выплат</CardTitle>
                <CardDescription>Все транзакции роялти</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(isNewUser ? [] : [
                    { date: '15.01.2025', amount: '30,400₽', status: 'completed', tracks: 18, streams: '450K' },
                    { date: '15.12.2024', amount: '27,455₽', status: 'completed', tracks: 16, streams: '412K' },
                    { date: '15.11.2024', amount: '25,175₽', status: 'completed', tracks: 15, streams: '380K' },
                    { date: '15.10.2024', amount: '22,800₽', status: 'completed', tracks: 14, streams: '345K' }
                  ]).map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon name="DollarSign" size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">{payment.date} • {payment.streams} прослушиваний</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="mb-1">
                          <Icon name="CheckCircle" size={12} className="mr-1" />
                          Выплачено
                        </Badge>
                        <p className="text-xs text-muted-foreground">{payment.tracks} треков</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Помощь и поддержка</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="gradient-card">
                <CardHeader>
                  <Icon name="MessageSquare" size={32} className="mb-2 text-primary" />
                  <CardTitle>Чат поддержки</CardTitle>
                  <CardDescription>Ответим в течение 5 минут</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Начать чат</Button>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <Icon name="Mail" size={32} className="mb-2 text-primary" />
                  <CardTitle>Email поддержка</CardTitle>
                  <CardDescription>maks3888d@gmail.com</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Написать письмо</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { q: 'Как долго длится дистрибуция?', a: 'Обычно 24-48 часов до появления на всех платформах' },
                  { q: 'Когда выплачиваются роялти?', a: 'Ежемесячно, до 15 числа следующего месяца' },
                  { q: 'Можно ли удалить трек после публикации?', a: 'Да, в любой момент через личный кабинет' }
                ].map((faq, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && isLoggedIn && (
          <div className="animate-fade-in">
            <div className="container mx-auto px-4 py-12">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Мой профиль</h1>
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

      <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Данные релиза - Шаг {releaseStep} из 3</DialogTitle>
            <DialogDescription>
              {releaseStep === 1 && 'Основная информация о релизе'}
              {releaseStep === 2 && 'Информация о треках и правообладателях'}
              {releaseStep === 3 && 'Проверка и отправка на модерацию'}
            </DialogDescription>
          </DialogHeader>

          {releaseStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название релиза</Label>
                <Input placeholder="Название альбома или сингла" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Тип релиза</Label>
                  <Select defaultValue="single">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Сингл</SelectItem>
                      <SelectItem value="ep">EP</SelectItem>
                      <SelectItem value="album">Альбом</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Жанр</Label>
                  <Select defaultValue="electronic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronic">Электроника</SelectItem>
                      <SelectItem value="pop">Поп</SelectItem>
                      <SelectItem value="rock">Рок</SelectItem>
                      <SelectItem value="hiphop">Хип-хоп</SelectItem>
                      <SelectItem value="jazz">Джаз</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Основной исполнитель</Label>
                <Input placeholder="Имя артиста" />
              </div>

              <div className="space-y-2">
                <Label>Дополнительные исполнители (опционально)</Label>
                <Input placeholder="feat. Artist Name" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата релиза</Label>
                  <Input type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label>UPC/EAN (опционально)</Label>
                  <Input placeholder="Штрихкод релиза" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Обложка релиза</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDraggingCover ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
                  onDragLeave={() => setIsDraggingCover(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingCover(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      const img = new Image();
                      img.onload = () => {
                        if (img.width === 3000 && img.height === 3000) {
                          setCoverImage(file);
                          setCoverPreview(URL.createObjectURL(file));
                        } else {
                          alert(`Неверный размер: ${img.width}x${img.height}. Требуется: 3000x3000 px`);
                        }
                      };
                      img.src = URL.createObjectURL(file);
                    } else {
                      alert('Загрузите изображение (JPG, PNG)');
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/png';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const img = new Image();
                        img.onload = () => {
                          if (img.width === 3000 && img.height === 3000) {
                            setCoverImage(file);
                            setCoverPreview(URL.createObjectURL(file));
                          } else {
                            alert(`Неверный размер: ${img.width}x${img.height}. Требуется: 3000x3000 px`);
                          }
                        };
                        img.src = URL.createObjectURL(file);
                      }
                    };
                    input.click();
                  }}
                >
                  {coverPreview ? (
                    <div className="relative">
                      <img src={coverPreview} alt="Cover" className="w-48 h-48 mx-auto object-cover rounded-lg" />
                      <div className="mt-4">
                        <p className="text-sm font-medium text-primary">✓ Обложка загружена</p>
                        <p className="text-xs text-muted-foreground">{coverImage?.name}</p>
                        <p className="text-xs text-muted-foreground">3000x3000 px</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Icon name="Image" size={48} className="mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Перетащите изображение или нажмите для выбора</p>
                      <p className="text-xs text-muted-foreground">Точный размер: 3000x3000 px</p>
                      <p className="text-xs text-muted-foreground mt-1">Формат: JPG, PNG</p>
                    </>
                  )}
                </div>
              </div>

              <Button className="w-full gradient-primary border-0" onClick={() => setReleaseStep(2)}>
                Далее: Треки и авторские права
                <Icon name="ArrowRight" className="ml-2" size={18} />
              </Button>
            </div>
          )}

          {releaseStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Трек 1</h3>
                
                <div className="space-y-2">
                  <Label>Название трека</Label>
                  <Input placeholder="Название композиции" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ISRC код (опционально)</Label>
                    <Input placeholder="ISRC трека" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Explicit контент</Label>
                    <Select defaultValue="clean">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clean">Clean</SelectItem>
                        <SelectItem value="explicit">Explicit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Авторы музыки</Label>
                  <Input placeholder="Композитор, продюсер" />
                </div>

                <div className="space-y-2">
                  <Label>Авторы текста</Label>
                  <Input placeholder="Автор текста" />
                </div>

                <div className="space-y-2">
                  <Label>Правообладатель записи (P)</Label>
                  <Input placeholder="© 2024 Your Label" />
                </div>

                <div className="space-y-2">
                  <Label>Правообладатель композиции (C)</Label>
                  <Input placeholder="℗ 2024 Your Publishing" />
                </div>

                <div className="space-y-2">
                  <Label>Аудиофайл трека</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      isDraggingAudio ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingAudio(true); }}
                    onDragLeave={() => setIsDraggingAudio(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingAudio(false);
                      const file = e.dataTransfer.files[0];
                      const validFormats = ['audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
                      const validExtensions = ['.wav', '.flac'];
                      const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                      
                      if (validFormats.includes(file.type) || validExtensions.includes(fileExt)) {
                        setAudioFile(file);
                      } else {
                        alert('Поддерживаются только форматы: WAV, FLAC');
                      }
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.wav,.flac,audio/wav,audio/flac';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const validExtensions = ['.wav', '.flac'];
                          const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
                          if (validExtensions.includes(fileExt)) {
                            setAudioFile(file);
                          } else {
                            alert('Поддерживаются только форматы: WAV, FLAC');
                          }
                        }
                      };
                      input.click();
                    }}
                  >
                    {audioFile ? (
                      <div>
                        <Icon name="Music" size={48} className="mx-auto mb-3 text-primary" />
                        <p className="text-sm font-medium text-primary">✓ Аудио загружено</p>
                        <p className="text-xs text-muted-foreground mt-1">{audioFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <Icon name="Upload" size={48} className="mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Перетащите аудиофайл или нажмите для выбора</p>
                        <p className="text-xs text-muted-foreground">Форматы: WAV, FLAC</p>
                        <p className="text-xs text-muted-foreground mt-1">Максимальное качество без потерь</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setReleaseStep(1)}>
                  <Icon name="ArrowLeft" className="mr-2" size={18} />
                  Назад
                </Button>
                <Button className="flex-1 gradient-primary border-0" onClick={() => setReleaseStep(3)}>
                  Далее: Проверка
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          )}

          {releaseStep === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Проверьте данные релиза</h3>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Название релиза:</p>
                    <p className="font-medium">Summer Vibes EP</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Тип:</p>
                    <p className="font-medium">EP</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Исполнитель:</p>
                    <p className="font-medium">DJ Example</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Дата релиза:</p>
                    <p className="font-medium">25.11.2024</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Платформы:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Spotify', 'Apple Music', 'YouTube Music', 'Deezer'].map((p) => (
                      <Badge key={p} variant="secondary">{p}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <Icon name="Info" className="text-primary mt-0.5" size={20} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Модерация релиза</h4>
                    <p className="text-sm text-muted-foreground">
                      После отправки ваш релиз будет проверен модератором в течение 24-48 часов. 
                      Вы получите уведомление о статусе модерации на email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded" />
                  <span className="text-sm">
                    Я подтверждаю, что обладаю всеми правами на распространение этой музыки и 
                    несу ответственность за предоставленную информацию
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded" />
                  <span className="text-sm">
                    Я ознакомлен с правилами дистрибуции и согласен с условиями обслуживания
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setReleaseStep(2)}>
                  <Icon name="ArrowLeft" className="mr-2" size={18} />
                  Назад
                </Button>
                <Button className="flex-1 gradient-primary border-0" onClick={() => { setReleaseDialogOpen(false); setReleaseStep(1); }}>
                  <Icon name="CheckCircle" className="mr-2" size={18} />
                  Отправить на модерацию
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;