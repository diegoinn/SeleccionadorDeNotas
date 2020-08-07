import pandas as pd
import Jornada

baseLinks=pd.read_excel('Catálogo_Notas.xlsx').fillna('')

notasJornada=baseLinks[baseLinks['Link de la nota'].str.contains('jornada')]
linksNotas=notasJornada['Link de la nota'].tolist()

print('\nDescargando Notas...')
notasDescargadas=Jornada.DescargaNotas(linksNotas)
print('\nGuardando Notas')
notasDescargadas.to_csv('Notas_Descargadas.csv')
print(notasDescargadas)