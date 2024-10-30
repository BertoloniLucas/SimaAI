from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle  # Para cargar el modelo serializado
import numpy as np
import os
import asyncio
import httpx
import uuid


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
        resultado = modelo.predict(datos)
        return resultado.tolist()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la predicción: {str(e)}")
    
    # Devuelve el resultado de la predicción como JSON
    return {"resultado": "Processing"}

async def model_output(task_id, datos):
    try:
        entrada_modelo = np.array([[datos.Gender, datos.Age, datos.Schooling, datos.Breastfeeding, datos.Varicella, datos.Initial_Symptom, datos.Mono_or_Polysymptomatic, datos.Oligoclonal_Bands, datos.LLSSEP, datos.ULSSEP, datos.VEP, datos.BAEP, datos.Periventricular_MRI, datos.Cortical_MRI, datos.Infratentorial_MRI, datos.Spinal_Cord_MRI]])

        resultado = modelo.predict(entrada_modelo)

        tasks[task_id] = {"status": "completed", "result": resultado.tolist()}

        async with httpx.AsyncClient() as client:
            await client.post(
                "https://sima-server.vercel.app/analysis/modelOutput",
                json={"result": resultado.tolist()},
                headers={"Content-Type": "application/json"}
            )
    except Exception as e:
        tasks[task_id] = {"status": "error", "result": str(e)}


@app.post("/predecir2")
async def predecir2(datos: DatosEntrada): 
     task_id = str(uuid.uuid4())
     tasks[task_id] = {"status": "processing", "result": None}

     asyncio.create_task(model_output(task_id, datos))

     return {"task_id": task_id, "status": "processing"}


@app.get("/status/{task_id}")
async def get_status(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task ID no encontrado")

    return tasks[task_id]