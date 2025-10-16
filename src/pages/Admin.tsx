import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Track {
  id: number;
  artist_name: string;
  track_title: string;
  album?: string;
  release_date?: string;
  genre?: string;
  cover_url?: string;
  audio_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at: string;
  moderated_at?: string;
  moderated_by?: string;
}

const Admin = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const API_URL = 'https://functions.poehali.dev/63c0389d-ff5a-4dd3-9bcf-e00529e51b09';

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?status=${filter}`);
      const data = await response.json();
      setTracks(data.tracks || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить треки',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [filter]);

  const handleApprove = async (trackId: number) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          track_id: trackId,
          action: 'approve',
          admin_name: 'Admin'
        })
      });

      if (response.ok) {
        toast({
          title: 'Успех',
          description: 'Трек одобрен'
        });
        fetchTracks();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось одобрить трек',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async () => {
    if (!selectedTrack) return;

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          track_id: selectedTrack.id,
          action: 'reject',
          rejection_reason: rejectionReason,
          admin_name: 'Admin'
        })
      });

      if (response.ok) {
        toast({
          title: 'Успех',
          description: 'Трек отклонён'
        });
        setRejectDialogOpen(false);
        setRejectionReason('');
        setSelectedTrack(null);
        fetchTracks();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отклонить трек',
        variant: 'destructive'
      });
    }
  };

  const openRejectDialog = (track: Track) => {
    setSelectedTrack(track);
    setRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'outline' as const, icon: 'Clock', text: 'На модерации' },
      approved: { variant: 'default' as const, icon: 'CheckCircle', text: 'Одобрен' },
      rejected: { variant: 'destructive' as const, icon: 'XCircle', text: 'Отклонён' }
    };
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {config.text}
      </Badge>
    );
  };

  const stats = {
    total: tracks.length,
    pending: tracks.filter(t => t.status === 'pending').length,
    approved: tracks.filter(t => t.status === 'approved').length,
    rejected: tracks.filter(t => t.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Панель администратора</h1>
          <p className="text-muted-foreground">Модерация треков артистов</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter('all')}>
            <CardHeader className="pb-3">
              <CardDescription>Всего треков</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter('pending')}>
            <CardHeader className="pb-3">
              <CardDescription>На модерации</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter('approved')}>
            <CardHeader className="pb-3">
              <CardDescription>Одобрено</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter('rejected')}>
            <CardHeader className="pb-3">
              <CardDescription>Отклонено</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-4 flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
            Все
          </Button>
          <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>
            На модерации
          </Button>
          <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')}>
            Одобренные
          </Button>
          <Button variant={filter === 'rejected' ? 'default' : 'outline'} onClick={() => setFilter('rejected')}>
            Отклонённые
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Icon name="Loader2" className="animate-spin" size={48} />
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Icon name="Music" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Треков не найдено</p>
                </CardContent>
              </Card>
            ) : (
              tracks.map(track => (
                <Card key={track.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Icon name="Music" size={32} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{track.track_title}</h3>
                            {getStatusBadge(track.status)}
                          </div>
                          <p className="text-muted-foreground mb-1">{track.artist_name}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            {track.album && <span>📀 {track.album}</span>}
                            {track.genre && <span>🎵 {track.genre}</span>}
                            {track.release_date && <span>📅 {new Date(track.release_date).toLocaleDateString('ru-RU')}</span>}
                          </div>
                          {track.rejection_reason && (
                            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                              <p className="text-sm text-destructive font-medium mb-1">Причина отклонения:</p>
                              <p className="text-sm text-destructive/80">{track.rejection_reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {track.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleApprove(track.id)} variant="default">
                            <Icon name="Check" size={18} className="mr-2" />
                            Одобрить
                          </Button>
                          <Button onClick={() => openRejectDialog(track)} variant="destructive">
                            <Icon name="X" size={18} className="mr-2" />
                            Отклонить
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить трек</DialogTitle>
            <DialogDescription>
              Укажите причину отклонения для артиста
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Например: Низкое качество звука, нарушение авторских прав..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              Отклонить трек
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
