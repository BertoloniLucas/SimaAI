from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle  # Para cargar el modelo serializado
import numpy as np
import os
import asyncio
import httpx

# Inicializa la aplicación de FastAPI
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sima-server.vercel.app", "https://sima-web-six.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carga el modelo pre-entrenado desde el archivo .pkl
try:
    with open("Selección_Modelo_Mejor_Predicción/opt_modelo.pkl", "rb") as f:
        modelo = pickle.load(f)
except FileNotFoundError:
    raise HTTPException(status_code=404, detail="El archivo del modelo no se encontró. Asegúrate de que 'opt_modelo.pkl' existe.")
    modelo = None

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

@app.get("/")
def init_route(): 
    return "Render API working correctly"


@app.post("/predecir")
async def predecir(datos: DatosEntrada):
    # Verificar si el modelo fue cargado correctamente
    if modelo is None:
        raise HTTPException(status_code=500, detail="El modelo no está disponible.")

    # Extrae los datos de entrada en un formato adecuado para el modelo
    entrada_modelo = np.array([[datos.Gender, datos.Age, datos.Schooling, datos.Breastfeeding, datos.Varicella, datos.Initial_Symptom, datos.Mono_or_Polysymptomatic, datos.Oligoclonal_Bands, datos.LLSSEP, datos.ULSSEP, datos.VEP, datos.BAEP, datos.Periventricular_MRI, datos.Cortical_MRI, datos.Infratentorial_MRI, datos.Spinal_Cord_MRI]])

    # Verifica la estructura de los datos de entrada antes de enviarlo al modelo
    print(f"Datos recibidos para predicción: {entrada_modelo}")
    
    # Verificar si el número de características coincide con lo que espera el modelo
    if hasattr(modelo, 'n_features_in_') and modelo.n_features_in_ != entrada_modelo.shape[1]:
        raise HTTPException(status_code=400, detail=f"El modelo espera {modelo.n_features_in_} características, pero se recibieron {entrada_modelo.shape[1]}.")
    
    # Realiza la predicción utilizando el modelo cargado
    try:
        asyncio.create_task(model_output(entrada_modelo))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la predicción: {str(e)}")
    
    # Devuelve el resultado de la predicción como JSON
    return {"resultado": "Processing"}

async def model_output(model_entry):
    try :
        resultado = modelo.predict(model_entry)
        async with httpx.AsyncClient() as client: 
            response = await client.post("https://sima-server.vercel.app/analysis/modelOutput", 
            json={"result": resultado},
            headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return
    except Exception as e: 
        print(str(e))
        return {"error": str(e)}
 
