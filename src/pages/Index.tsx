import { useState } from 'react';
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

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [releaseStep, setReleaseStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Icon name="Music" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">MusicHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setActiveTab('home')} className="text-sm hover:text-primary transition-colors">Главная</button>
              <button onClick={() => setActiveTab('catalog')} className="text-sm hover:text-primary transition-colors">Каталог</button>
              <button onClick={() => setActiveTab('dashboard')} className="text-sm hover:text-primary transition-colors">Личный кабинет</button>
              <button onClick={() => setActiveTab('upload')} className="text-sm hover:text-primary transition-colors">Загрузка</button>
              <button onClick={() => setActiveTab('pricing')} className="text-sm hover:text-primary transition-colors">Тарифы</button>
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
                  <Button variant="ghost" size="sm">
                    <Icon name="User" size={18} className="mr-2" />
                    Профиль
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>
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
                  <div className="flex gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Button size="lg" className="gradient-primary border-0">
                      <Icon name="Upload" className="mr-2" size={20} />
                      Загрузить трек
                    </Button>
                    <Button size="lg" variant="outline">
                      <Icon name="Play" className="mr-2" size={20} />
                      Как это работает
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="group hover:scale-105 transition-transform">
                  <CardHeader>
                    <div className="relative w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 flex items-center justify-center">
                      <Icon name="Music" size={64} className="text-muted-foreground" />
                      <Button size="icon" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity gradient-primary border-0">
                        <Icon name="Play" size={24} />
                      </Button>
                    </div>
                    <CardTitle>Название трека {i}</CardTitle>
                    <CardDescription>Исполнитель • Альбом</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Play" size={16} />
                        {(Math.random() * 10).toFixed(1)}M
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Download" size={16} />
                        {(Math.random() * 5).toFixed(1)}M
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  <div className="text-3xl font-bold">1.2M</div>
                  <p className="text-sm text-primary mt-1">+15% за месяц</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Заработано роялти</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">300€</div>
                  <p className="text-sm text-primary mt-1">+22% за месяц</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Загружено треков</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">18</div>
                  <p className="text-sm text-muted-foreground mt-1">На 5 платформах</p>
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
                  {[
                    { title: 'Summer Vibes', plays: 450000, earnings: 120, status: 'active', moderation: 'approved' },
                    { title: 'Night Drive', plays: 320000, earnings: 89, status: 'active', moderation: 'approved' },
                    { title: 'Ocean Waves', plays: 180000, earnings: 52, status: 'processing', moderation: 'pending' },
                    { title: 'New Track', plays: 0, earnings: 0, status: 'draft', moderation: 'review' }
                  ].map((track, i) => (
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
                            <p className="font-semibold">{track.earnings}€</p>
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
            
            {isLoggedIn && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Панель модератора</CardTitle>
                  <CardDescription>Проверка новых релизов перед публикацией</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { artist: 'DJ Example', title: 'New Summer Hit', date: '2024-10-15', status: 'pending' },
                      { artist: 'Artist Two', title: 'Midnight Dreams', date: '2024-10-14', status: 'pending' }
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
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
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

        {activeTab === 'pricing' && (
          <div className="container mx-auto px-4 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center mb-4">Тарифы и цены</h1>
            <p className="text-center text-muted-foreground mb-12">Выберите план, который подходит вам</p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { name: 'Starter', price: '9.99€', tracks: '5 треков', royalty: '80%', features: ['Дистрибуция на 3 платформы', 'Базовая аналитика', 'Email поддержка'] },
                { name: 'Pro', price: '29.99€', tracks: 'Без лимита', royalty: '90%', features: ['Дистрибуция на все платформы', 'Расширенная аналитика', 'Приоритетная поддержка', 'Кастомизация профиля'], popular: true },
                { name: 'Label', price: '99.99€', tracks: 'Без лимита', royalty: '95%', features: ['Все возможности Pro', 'Мультиаккаунт', 'API доступ', 'Персональный менеджер'] }
              ].map((plan, i) => (
                <Card key={i} className={plan.popular ? 'border-primary shadow-lg shadow-primary/20' : ''}>
                  {plan.popular && (
                    <div className="gradient-primary text-white text-center py-2 rounded-t-lg text-sm font-medium">
                      Популярный
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="text-4xl font-bold mt-4">{plan.price}<span className="text-lg text-muted-foreground">/мес</span></div>
                    <CardDescription className="mt-2">{plan.tracks}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-primary" />
                      <span className="text-sm">{plan.royalty} роялти</span>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Icon name="Check" size={16} className="text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className={plan.popular ? 'w-full gradient-primary border-0' : 'w-full'} variant={plan.popular ? 'default' : 'outline'}>
                      Выбрать план
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  <CardDescription>support@musichub.com</CardDescription>
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
      </main>

      <footer className="border-t border-border mt-20 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Icon name="Music" className="text-white" size={16} />
                </div>
                <span className="font-bold">MusicHub</span>
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
            © 2024 MusicHub. Все права защищены.
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
                <Input id="login-email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input id="login-password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full gradient-primary border-0" onClick={() => { setIsLoggedIn(true); setIsAuthOpen(false); }}>
                Войти
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Нет аккаунта? <button className="text-primary hover:underline" onClick={() => setAuthMode('register')}>Зарегистрироваться</button>
              </p>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reg-type">Тип аккаунта</Label>
                <Select defaultValue="artist">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artist">Артист</SelectItem>
                    <SelectItem value="label">Лейбл</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-name">Имя / Название</Label>
                <Input id="reg-name" placeholder="Ваше имя или название лейбла" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input id="reg-password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full gradient-primary border-0" onClick={() => { setIsLoggedIn(true); setIsAuthOpen(false); }}>
                Создать аккаунт
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
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Icon name="Image" size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Загрузите обложку (минимум 3000x3000 px)</p>
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