import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  email: string;
  username: string;
  artist_name: string | null;
  role: string;
  total_tracks: number;
  total_streams: number;
  total_earnings: number;
  created_at: string;
  avatar_url: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_spotify: string | null;
  social_vk: string | null;
}

interface AdminUsersPanelProps {
  authApi: string;
}

const AdminUsersPanel = ({ authApi }: AdminUsersPanelProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${authApi}?action=get_all_users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': localStorage.getItem('auth_token') || ''
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.message || 'Ошибка загрузки пользователей');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <div className="flex items-center gap-3">
            <Icon name="AlertCircle" size={24} className="text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">Ошибка</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={loadUsers}
          >
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Пользователей пока нет</h3>
        <p className="text-sm text-muted-foreground">
          Зарегистрированные пользователи появятся здесь
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Все пользователи</h3>
          <p className="text-sm text-muted-foreground">Всего зарегистрировано: {users.length}</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadUsers}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить
        </Button>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Icon name="User" size={24} className="text-primary" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{user.username}</h4>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className={user.role === 'admin' ? 'gradient-primary border-0' : ''}
                    >
                      {user.role === 'admin' ? 'Админ' : 'Артист'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                  
                  {user.artist_name && (
                    <p className="text-sm mb-2">
                      <Icon name="Music" size={14} className="inline mr-1" />
                      {user.artist_name}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      <Icon name="Disc" size={12} className="inline mr-1" />
                      Треков: {user.total_tracks}
                    </span>
                    <span>
                      <Icon name="Play" size={12} className="inline mr-1" />
                      Прослушиваний: {user.total_streams.toLocaleString()}
                    </span>
                    <span>
                      <Icon name="DollarSign" size={12} className="inline mr-1" />
                      Заработок: ${user.total_earnings}
                    </span>
                  </div>
                  
                  {(user.social_instagram || user.social_youtube || user.social_spotify || user.social_vk) && (
                    <div className="flex gap-2 mt-3">
                      {user.social_instagram && (
                        <a 
                          href={user.social_instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Icon name="Instagram" size={16} />
                        </a>
                      )}
                      {user.social_youtube && (
                        <a 
                          href={user.social_youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Icon name="Youtube" size={16} />
                        </a>
                      )}
                      {user.social_spotify && (
                        <a 
                          href={user.social_spotify} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Icon name="Music" size={16} />
                        </a>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    <Icon name="Calendar" size={12} className="inline mr-1" />
                    Регистрация: {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <Icon name="Eye" size={14} className="mr-1" />
                  Профиль
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPanel;
