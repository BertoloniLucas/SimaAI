from fastapi import FastAPI
from pydantic import BaseModel
import pickle  # Para cargar el modelo serializado
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, roc_auc_score
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt
import wandb
import os

# Inicializa la aplicación de FastAPI
app = FastAPI()

# Carga el modelo pre-entrenado desde el archivo .pkl
with open("models/modelo_svm_optimizado.pkl", "rb") as f:
    modelo = pickle.load(f)

# Define el esquema de datos de entrada usando Pydantic
class DatosEntrada(BaseModel):
    Gender: int
    Age: int
    Schooling: float
    Breastfeeding: int
    Varicella: int
    Initial_Symptom: float
    Mono_or_Polysymptomatic: int
    Oligoclonal_Bands: int
    LLSSEP: int
    ULSSEP: int
    VEP: int
    BAEP: int
    Periventricular_MRI: int
    Cortical_MRI: int
    Infratentorial_MRI: int
    Spinal_Cord_MRI: int 

# Define el endpoint de la API
@app.post("/predecir/")
def predecir(datos: DatosEntrada):
    # Extrae los datos de entrada en un formato adecuado para el modelo
    entrada_modelo = np.array([[datos.Gender, datos.Age, datos.Breastfeeding, datos.Varicella, datos.Initial_Symptom, datos.Mono_or_Polysymptomatic, datos.Oligoclonal_Bands, datos.LLSSEP, datos.ULSSEP, datos.VEP, datos.BAEP, datos.Periventricular_MRI, datos.Cortical_MRI, datos.Infratentorial_MRI, datos.Spinal_Cord_MRI]])
    
    # Realiza la predicción utilizando el modelo cargado
    resultado = modelo.predict(entrada_modelo)
    
    # Devuelve el resultado de la predicción como JSON
    return {"resultado": resultado.tolist()}
