from Tools import Jornada
from Tools import Reforma
import pickle
import datetime
import pandas as pd
import sklearn
import sklearn.pipeline
import sklearn.feature_extraction
import sklearn.utils._cython_blas
import sklearn.neighbors.quad_tree
import sklearn.neighbors._typedefs
import sklearn.tree
import sklearn.tree._utils

hoy = datetime.datetime.now()

fecha = hoy.strftime('%Y_%m_%d')


print('Descargando notas Jornada...')
notas = Jornada.DescargaNotasDiarias(True)

print('\n\nDescargando notas Reforma...')
notasReforma = Reforma.NotasReforma(True)

notas = notas.append(notasReforma, ignore_index=True)

# notas.to_excel(f'Notas_{fecha}.xlsx')
# notas= pd.read_excel('Notas_2020_10_20.xlsx')

notas.drop(notas[notas.Texto.isnull()].index,inplace=True)

print('\n\nCargando Modelo...')
modelo = None
with open('Models/Modelo_3.pkl','rb') as f:
    modelo = pickle.load(f)
if modelo is not None:
    prediccion=modelo.predict(notas.Texto)
    modelo.probability = True
    proba=modelo.predict_proba(notas.Texto)

    # print(proba)
    notas['Prediccion']=prediccion
    notas['PrediccionEtiqueta']='No'
    notas.loc[notas.Prediccion==1,'PrediccionEtiqueta']='Si'

    notas['Probabilidad_Si'],notas['Probabilidad_No'] = proba[:,1],proba[:,0]

    notas=notas.sort_values(by='Prediccion',ascending=False)

    notas[['Titulo','Autor','Referencia','Texto','link','Prediccion','PrediccionEtiqueta','Probabilidad_Si','Probabilidad_No']].to_excel(f'Predicciones_{fecha}.xlsx',index=False)
else:
    print('Error: No se pudo cargar modelo.')

print('\n\nPresiona enter para terminar.')
input()