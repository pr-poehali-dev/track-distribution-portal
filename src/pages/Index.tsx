import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

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
              <Button variant="ghost" size="sm">Войти</Button>
              <Button size="sm" className="gradient-primary border-0">Начать</Button>
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
                    { title: 'Summer Vibes', plays: 450000, earnings: 120, status: 'active' },
                    { title: 'Night Drive', plays: 320000, earnings: 89, status: 'active' },
                    { title: 'Ocean Waves', plays: 180000, earnings: 52, status: 'processing' }
                  ].map((track, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Icon name="Music" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">{track.plays.toLocaleString()} прослушиваний</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold">{track.earnings}€</p>
                          <p className="text-sm text-muted-foreground">роялти</p>
                        </div>
                        <Badge variant={track.status === 'active' ? 'default' : 'secondary'}>
                          {track.status === 'active' ? 'Активен' : 'Обработка'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

                  <Button className="w-full gradient-primary border-0" size="lg">
                    <Icon name="Send" className="mr-2" size={20} />
                    Отправить на дистрибуцию
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
    </div>
  );
};

export default Index;