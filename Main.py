import Jornada
import Reforma
import time


ti=time.time()

links=Jornada.ObtenLinksDiarios()

tiempo=time.time()-ti

print('\nSe tardó',round(tiempo,2),'s en obtener los links')


ti=time.time()

notas=Jornada.DescargaNotas(links)
tiempo=time.time()-ti



# print(notas)

print('\nSe tardó:',round(tiempo,2),'s para descargar',len(links),'Notas',round(tiempo/len(links),4),'s/Nota')