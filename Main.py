from Tools import Jornada
from Tools import Reforma
import requests
import time
import re
from bs4 import BeautifulSoup

# ti=time.time()

# links=Jornada.ObtenLinksDiarios()

# tiempo=time.time()-ti

# print('\nSe tardó',round(tiempo,2),'s en obtener los links')


# ti=time.time()

# notas=Jornada.DescargaNotas(links)
# tiempo=time.time()-ti



# print(notas)

# print('\nSe tardó:',round(tiempo,2),'s para descargar',len(links),'Notas',round(tiempo/len(links),4),'s/Nota')


# link = Reforma.CrearUrl('2185603')

# folio=2186234
# for i in range(1,1000):
#     folio+=1
#     link = Reforma.CrearUrl(str(folio))
#     source = requests.get(link).text
#     soup = BeautifulSoup(source, 'html.parser')
#     titulo = soup.title.text if soup.title is not None else 'No Hay'
#     patronFecha= re.compile(r'\d\d\d\d-\d\d-\d\d')  
#     fechaSubida=patronFecha.findall(source)
#     fecha = fechaSubida[0] if len(fechaSubida)>0 else 'No hay fecha'
#     print(folio, titulo, fecha)
# patronSeccion= re.compile(r'var NombreSeccion = (.*);')
# NombreSeccion=patronSeccion.search(source)
# x = re.split("\s", NombreSeccion.group())
# tempSeccion=x[3].replace('\'','')
# NombreSeccion=tempSeccion.replace(';','')
# print(link)

# with open('Nota.html','w') as f:
#     f.write(source)

# notasReforma = Reforma.NotasReforma(True)

notasJornada = Jornada.DescargaNotasDiarias(True)
