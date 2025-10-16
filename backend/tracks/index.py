'''
Business: API для управления треками - получение списка, модерация (одобрение/отклонение)
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response dict с данными треков или результатом модерации
'''

import json
import os
from typing import Dict, Any, List
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        status_filter = params.get('status', 'all')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if status_filter == 'all':
            cur.execute('''
                SELECT id, artist_name, track_title, album, release_date, 
                       genre, cover_url, audio_url, status, rejection_reason,
                       submitted_at, moderated_at, moderated_by
                FROM tracks
                ORDER BY submitted_at DESC
            ''')
        else:
            cur.execute('''
                SELECT id, artist_name, track_title, album, release_date, 
                       genre, cover_url, audio_url, status, rejection_reason,
                       submitted_at, moderated_at, moderated_by
                FROM tracks
                WHERE status = %s
                ORDER BY submitted_at DESC
            ''' % f"'{status_filter}'")
        
        tracks = cur.fetchall()
        
        for track in tracks:
            if track['submitted_at']:
                track['submitted_at'] = track['submitted_at'].isoformat()
            if track['moderated_at']:
                track['moderated_at'] = track['moderated_at'].isoformat()
            if track['release_date']:
                track['release_date'] = track['release_date'].isoformat()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'tracks': tracks})
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        track_id = body_data.get('track_id')
        action = body_data.get('action')
        rejection_reason = body_data.get('rejection_reason', '')
        admin_name = body_data.get('admin_name', 'Admin')
        
        if not track_id or action not in ['approve', 'reject']:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid parameters'})
            }
        
        new_status = 'approved' if action == 'approve' else 'rejected'
        now = datetime.now().isoformat()
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('''
            UPDATE tracks 
            SET status = %s, 
                rejection_reason = %s, 
                moderated_at = %s,
                moderated_by = %s
            WHERE id = %s
        ''' % (f"'{new_status}'", f"'{rejection_reason}'", f"'{now}'", f"'{admin_name}'", track_id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': f'Track {action}d successfully'
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
