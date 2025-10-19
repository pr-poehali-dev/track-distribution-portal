'''
Business: API для управления подписками между пользователями
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id, function_name
Returns: HTTP response с результатом операции
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST' and action == 'follow':
        body_data = json.loads(event.get('body', '{}'))
        follower_id = body_data.get('follower_id')
        following_id = body_data.get('following_id')
        
        if not follower_id or not following_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'follower_id и following_id обязательны'})
            }
        
        if follower_id == following_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Нельзя подписаться на самого себя'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT id FROM user_follows 
            WHERE follower_id = %s AND following_id = %s
        ''' % (follower_id, following_id))
        
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Уже подписаны'})
            }
        
        cur.execute('''
            INSERT INTO user_follows (follower_id, following_id)
            VALUES (%s, %s)
            RETURNING id, created_at
        ''' % (follower_id, following_id))
        
        follow = cur.fetchone()
        
        cur.execute('''
            UPDATE users SET followers_count = followers_count + 1 
            WHERE id = %s
        ''' % following_id)
        
        cur.execute('''
            UPDATE users SET following_count = following_count + 1 
            WHERE id = %s
        ''' % follower_id)
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'message': 'Подписка успешна',
                'follow_id': follow['id']
            })
        }
    
    if method == 'POST' and action == 'unfollow':
        body_data = json.loads(event.get('body', '{}'))
        follower_id = body_data.get('follower_id')
        following_id = body_data.get('following_id')
        
        if not follower_id or not following_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'follower_id и following_id обязательны'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT id FROM user_follows 
            WHERE follower_id = %s AND following_id = %s
        ''' % (follower_id, following_id))
        
        if not cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Подписка не найдена'})
            }
        
        cur.execute('BEGIN')
        
        cur.execute('''
            UPDATE users SET followers_count = GREATEST(followers_count - 1, 0) 
            WHERE id = %s
        ''' % following_id)
        
        cur.execute('''
            UPDATE users SET following_count = GREATEST(following_count - 1, 0) 
            WHERE id = %s
        ''' % follower_id)
        
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
                'message': 'Отписка успешна'
            })
        }
    
    if method == 'GET' and action == 'check':
        follower_id = params.get('follower_id')
        following_id = params.get('following_id')
        
        if not follower_id or not following_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'follower_id и following_id обязательны'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT id FROM user_follows 
            WHERE follower_id = %s AND following_id = %s
        ''' % (follower_id, following_id))
        
        is_following = cur.fetchone() is not None
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
                'is_following': is_following
            })
        }
    
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Неверный метод или действие'})
    }
