import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import UserProfileCard from '@/components/UserProfileCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  bio: string | null;
  about_me: string | null;
  interests: string | null;
  achievements: string | null;
  followers_count: number;
  following_count: number;
  cover_url: string | null;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

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

  const openProfile = (user: User) => {
    setSelectedUser(user);
    setProfileDialogOpen(true);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} onClick={() => openProfile(user)} className="cursor-pointer">
            <UserProfileCard 
              user={user} 
              showActions={false}
            />
          </div>
        ))}
      </div>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Профиль пользователя</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserProfileCard 
              user={selectedUser} 
              showActions={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPanel;
