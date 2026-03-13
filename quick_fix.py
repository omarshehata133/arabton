import sqlite3
import os

conn = sqlite3.connect('arabton.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT id, emoji, animation_file FROM wheel_prizes WHERE name = 'NFT' AND is_active = 1")
nfts = cursor.fetchall()

for i, nft in enumerate(nfts):
    if i == 0:
        cursor.execute("UPDATE wheel_prizes SET emoji = '🎄', animation_file = 'NFTXmasStocking.json' WHERE id = ?", (nft['id'],))
    elif i == 1:
        cursor.execute("UPDATE wheel_prizes SET emoji = '🧁', animation_file = 'NFTWhipcupcake.json' WHERE id = ?", (nft['id'],))

conn.commit()
conn.close()
print('تم الإصلاح بنجاح!')
