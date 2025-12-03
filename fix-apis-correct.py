#!/usr/bin/env python3
"""
Corrige todos os arquivos de API para TypeScript null safety
"""
import os
import re

def fix_api_route(filepath):
    """Corrige um arquivo de rota da API"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    barbershop_id_added = False
    
    while i < len(lines):
        line = lines[i]
        
        # Detectar o if de verificação de sessão
        if 'if (!session ||' in line and not barbershop_id_added:
            # Adicionar a linha atual
            new_lines.append(line)
            
            # Encontrar o fechamento do if (próxima linha com })
            i += 1
            while i < len(lines):
                new_lines.append(lines[i])
                if '}' in lines[i] and 'return' in lines[i-1]:
                    # Adicionar const barbershopId após o fechamento
                    indent = '    '
                    new_lines.append(f'\n{indent}const barbershopId = session.user.barbershopId\n')
                    barbershop_id_added = True
                    i += 1
                    break
                i += 1
            continue
        
        # Se já adicionamos barbershopId, substituir session.user?.barbershopId por barbershopId
        if barbershop_id_added:
            line = line.replace('session.user?.barbershopId', 'barbershopId')
            line = line.replace('session.user.barbershopId', 'barbershopId')
        
        new_lines.append(line)
        i += 1
    
    # Escrever de volta
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Fixed: {filepath}")

# Lista de arquivos para corrigir
api_files = [
    'app/api/attendance/list/route.ts',
    'app/api/attendance/stats/route.ts',
    'app/api/barber/create/route.ts',
    'app/api/barber/delete/route.ts',
    'app/api/barber/list/route.ts',
    'app/api/barber/toggle-pause/route.ts',
    'app/api/barber/update/route.ts',
    'app/api/queue/add/route.ts',
    'app/api/queue/complete-and-next/route.ts',
    'app/api/queue/get/route.ts',
    'app/api/queue/pause/route.ts',
    'app/api/queue/reorder/route.ts',
    'app/api/queue/remove/route.ts',
    'app/api/queue/start-attending/route.ts',
]

print("Corrigindo arquivos da API...")
for filepath in api_files:
    if os.path.exists(filepath):
        fix_api_route(filepath)

print("\nConcluído!")

