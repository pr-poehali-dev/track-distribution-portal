import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface UserProfile {
  id: number;
  username: string;
  artist_name: string | null;
  email: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  about_me: string | null;
  interests: string | null;
  achievements: string | null;
  role: string;
  total_tracks: number;
  total_streams: number;
  total_earnings: number;
  followers_count: number;
  following_count: number;
  social_instagram: string | null;
  social_youtube: string | null;
  social_spotify: string | null;
  social_vk: string | null;
  created_at: string;
}

interface UserProfileCardProps {
  user: UserProfile;
  currentUserId?: number;
  isFollowing?: boolean;
  onFollowToggle?: (userId: number) => void;
  showActions?: boolean;
}

const UserProfileCard = ({ 
  user, 
  currentUserId, 
  isFollowing = false, 
  onFollowToggle,
  showActions = true 
}: UserProfileCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isOwnProfile = currentUserId === user.id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const parseList = (text: string | null): string[] => {
    if (!text) return [];
    return text.split(',').map(item => item.trim()).filter(Boolean);
  };

  const interestsList = parseList(user.interests);
  const achievementsList = parseList(user.achievements);

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all">
      <div 
        className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative"
        style={user.cover_url ? { 
          backgroundImage: `url(${user.cover_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {user.role === 'admin' && (
          <Badge className="absolute top-3 right-3 gradient-primary border-0">
            <Icon name="Shield" size={12} className="mr-1" />
            Админ
          </Badge>
        )}
      </div>

      <div className="p-6 pt-0">
        <div className="flex items-start gap-4 -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-background bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="User" size={40} className="text-primary" />
            )}
          </div>

          <div className="flex-1 mt-14">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{user.artist_name || user.username}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
              
              {showActions && !isOwnProfile && onFollowToggle && (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  className={!isFollowing ? "gradient-primary border-0" : ""}
                  onClick={() => onFollowToggle(user.id)}
                >
                  <Icon 
                    name={isFollowing ? "UserMinus" : "UserPlus"} 
                    size={16} 
                    className="mr-2" 
                  />
                  {isFollowing ? 'Отписаться' : 'Следить'}
                </Button>
              )}
            </div>

            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <span className="font-semibold">{user.followers_count}</span>
                <span className="text-muted-foreground">подписчиков</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{user.following_count}</span>
                <span className="text-muted-foreground">подписок</span>
              </div>
            </div>
          </div>
        </div>

        {(user.bio || user.about_me) && (
          <div className="mb-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <h4 className="font-semibold text-sm">О себе</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.about_me || user.bio}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Music" size={16} className="text-primary" />
              <p className="text-xl font-bold">{user.total_tracks}</p>
            </div>
            <p className="text-xs text-muted-foreground">Треков</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Play" size={16} className="text-primary" />
              <p className="text-xl font-bold">{user.total_streams.toLocaleString()}</p>
            </div>
            <p className="text-xs text-muted-foreground">Прослушиваний</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <p className="text-xl font-bold">${user.total_earnings}</p>
            </div>
            <p className="text-xs text-muted-foreground">Заработано</p>
          </div>
        </div>

        {interestsList.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Heart" size={16} className="text-primary" />
              <h4 className="font-semibold text-sm">Интересы</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {interestsList.map((interest, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {achievementsList.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Award" size={16} className="text-primary" />
              <h4 className="font-semibold text-sm">Достижения</h4>
            </div>
            <div className="space-y-2">
              {achievementsList.slice(0, expanded ? achievementsList.length : 3).map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <Icon name="CheckCircle" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{achievement}</span>
                </div>
              ))}
              {achievementsList.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Скрыть' : `Показать ещё ${achievementsList.length - 3}`}
                  <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={14} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {(user.social_instagram || user.social_youtube || user.social_spotify || user.social_vk) && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Link" size={16} className="text-muted-foreground" />
              <h4 className="font-semibold text-sm">Социальные сети</h4>
            </div>
            <div className="flex gap-3">
              {user.social_instagram && (
                <a 
                  href={user.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Instagram" size={20} />
                </a>
              )}
              {user.social_youtube && (
                <a 
                  href={user.social_youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Youtube" size={20} />
                </a>
              )}
              {user.social_spotify && (
                <a 
                  href={user.social_spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <Icon name="Music" size={20} />
                </a>
              )}
              {user.social_vk && (
                <a 
                  href={user.social_vk} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <Icon name="MessageCircle" size={20} />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Calendar" size={12} />
            <span>На платформе с {formatDate(user.created_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfileCard;
