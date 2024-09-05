from fastapi import FastAPI
from pydantic import BaseModel
import pickle

# Cargar el modelo entrenado desde el archivo .pkl
with open('modelo_svm_optimizado.pkl', 'rb') as f:
    modelo = pickle.load(f)

# Inicializar la aplicación FastAPI
app = FastAPI()

# Crear un modelo de datos para la solicitud
class PredictionRequest(BaseModel):
    input: list

# Definir el endpoint para predicciones
@app.post("/predict")
async def predict(request: PredictionRequest):
    # Obtener los datos de entrada de la solicitud
    entrada = request.input

    # Realizar la predicción
    prediccion = modelo.predict([entrada])

    # Devolver la predicción como JSON
    return {"prediction": prediccion.tolist()}
