import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface UserProfile {
  id: number;
  email: string;
  username: string;
  artist_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  social_instagram?: string;
  social_youtube?: string;
  social_spotify?: string;
  social_vk?: string;
  role: string;
  total_tracks: number;
  total_streams: number;
  total_earnings: number;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    artist_name: '',
    bio: '',
    avatar_url: '',
    cover_url: '',
    social_instagram: '',
    social_youtube: '',
    social_spotify: '',
    social_vk: ''
  });
  
  const API_URL = 'https://functions.poehali.dev/ca51393e-6fb5-4308-a0f7-ff6e93d59ff5';

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/');
      return;
    }
    
    fetchProfile(userId);
  }, []);

  const fetchProfile = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=profile&user_id=${userId}`);
      const data = await response.json();
      
      if (data.user) {
        setProfile(data.user);
        setFormData({
          artist_name: data.user.artist_name || '',
          bio: data.user.bio || '',
          avatar_url: data.user.avatar_url || '',
          cover_url: data.user.cover_url || '',
          social_instagram: data.user.social_instagram || '',
          social_youtube: data.user.social_youtube || '',
          social_spotify: data.user.social_spotify || '',
          social_vk: data.user.social_vk || ''
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить профиль',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}?action=profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Успех',
          description: 'Профиль обновлён'
        });
        setIsEditing(false);
        fetchProfile(userId);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
            <p className="text-lg mb-4">Профиль не найден</p>
            <Button onClick={() => navigate('/')}>На главную</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-64 bg-gradient-to-br from-primary/20 to-primary/10 relative"
        style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute top-4 left-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative">
        <div className="flex items-end gap-6 mb-8">
          <div className="w-32 h-32 rounded-full bg-card border-4 border-background overflow-hidden flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.artist_name} className="w-full h-full object-cover" />
            ) : (
              <Icon name="User" size={48} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 bg-card/80 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1">{profile.artist_name || profile.username}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'default'}>
                <Icon name={isEditing ? 'X' : 'Edit'} size={18} className="mr-2" />
                {isEditing ? 'Отменить' : 'Редактировать'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Треков загружено</CardDescription>
              <CardTitle className="text-3xl">{profile.total_tracks}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Всего прослушиваний</CardDescription>
              <CardTitle className="text-3xl">{profile.total_streams.toLocaleString('ru-RU')}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Заработано</CardDescription>
              <CardTitle className="text-3xl">{profile.total_earnings.toLocaleString('ru-RU')}₽</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {isEditing ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Редактирование профиля</CardTitle>
              <CardDescription>Обновите информацию о себе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="artist_name">Имя артиста</Label>
                  <Input
                    id="artist_name"
                    value={formData.artist_name}
                    onChange={(e) => setFormData({...formData, artist_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="avatar_url">Ссылка на аватар</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cover_url">Ссылка на обложку профиля</Label>
                <Input
                  id="cover_url"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({...formData, cover_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="bio">О себе</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  placeholder="Расскажите о себе..."
                />
              </div>

              <div className="space-y-2">
                <Label>Социальные сети</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="Instagram" size={20} />
                    <Input
                      value={formData.social_instagram}
                      onChange={(e) => setFormData({...formData, social_instagram: e.target.value})}
                      placeholder="instagram.com/username"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Youtube" size={20} />
                    <Input
                      value={formData.social_youtube}
                      onChange={(e) => setFormData({...formData, social_youtube: e.target.value})}
                      placeholder="youtube.com/@username"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Music" size={20} />
                    <Input
                      value={formData.social_spotify}
                      onChange={(e) => setFormData({...formData, social_spotify: e.target.value})}
                      placeholder="open.spotify.com/artist/..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Radio" size={20} />
                    <Input
                      value={formData.social_vk}
                      onChange={(e) => setFormData({...formData, social_vk: e.target.value})}
                      placeholder="vk.com/username"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {profile.bio && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>О себе</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {(profile.social_instagram || profile.social_youtube || profile.social_spotify || profile.social_vk) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Социальные сети</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  {profile.social_instagram && (
                    <a href={`https://${profile.social_instagram}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Icon name="Instagram" size={18} className="mr-2" />
                        Instagram
                      </Button>
                    </a>
                  )}
                  {profile.social_youtube && (
                    <a href={`https://${profile.social_youtube}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Icon name="Youtube" size={18} className="mr-2" />
                        YouTube
                      </Button>
                    </a>
                  )}
                  {profile.social_spotify && (
                    <a href={`https://${profile.social_spotify}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Icon name="Music" size={18} className="mr-2" />
                        Spotify
                      </Button>
                    </a>
                  )}
                  {profile.social_vk && (
                    <a href={`https://${profile.social_vk}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Icon name="Radio" size={18} className="mr-2" />
                        VK
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
