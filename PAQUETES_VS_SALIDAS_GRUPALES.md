# Diferencia entre Paquetes y Salidas Grupales

## 📦 Paquetes (Como el de Camboriú)

Los **paquetes** son ofertas de viaje que:

- ✅ Se muestran en la sección de **"Paquetes Disponibles"** de cada destino
- ✅ Tienen fechas flexibles (por mes, no fechas específicas)
- ✅ Incluyen servicios como alojamiento, transporte, comidas, etc.
- ✅ Se pueden personalizar según las necesidades del cliente
- ✅ Ejemplo: "Viaje a Balneário Camboriú - 7 Noches"

### Características del Paquete de Camboriú:
- **Destino**: Camboriú (Brasil)
- **Duración**: 7 noches
- **Cupos**: 45 personas
- **Fechas**: Febrero - Diciembre 2026 (flexibles)
- **Incluye**: Transporte, alojamiento, desayunos, cenas, coordinador, asistencia médica
- **Tipo**: Paquete normal (NO es salida grupal)

---

## 👥 Salidas Grupales

Las **salidas grupales** son viajes que:

- ✅ Tienen una **fecha específica de salida**
- ✅ Son para grupos organizados
- ✅ Salen en una fecha fija (no flexible)
- ✅ Tienen cupos limitados
- ✅ Se muestran en la sección **"Salidas Grupales"**
- ✅ Ejemplo: "Salida grupal a Bariloche - 15 de Julio 2026"

### Todavía no hay salidas grupales cargadas
Por ahora, el array `salidasGrupales` está vacío en el seed.js. Cuando agregues salidas grupales, deberás especificar:

- Fecha exacta de salida (ej: "15 de Julio 2026")
- Punto de encuentro específico
- Horario de salida
- Itinerario día por día
- Cupos exactos disponibles

---

## 🔍 Resumen de Diferencias

| Característica | Paquetes | Salidas Grupales |
|----------------|----------|------------------|
| **Fechas** | Flexibles (por mes) | Fecha específica fija |
| **Personalización** | Sí, se puede adaptar | No, itinerario fijo |
| **Salida** | Cuando el cliente quiera | Fecha única de salida |
| **Ubicación en web** | Sección "Paquetes" del destino | Sección "Salidas Grupales" |
| **Ejemplo** | "Febrero - Diciembre 2026" | "15 de Julio 2026, 8:00 AM" |

---

## 📝 Nota Importante

El paquete de **Balneário Camboriú - 7 Noches** que creamos es un **PAQUETE NORMAL**, NO una salida grupal. 

Se muestra en la sección de paquetes del destino Camboriú y tiene fechas flexibles por mes (Febrero - Diciembre 2026).

Cuando quieras agregar salidas grupales, deberás crear nuevas ofertas con fechas específicas y agregarlas al array `salidasGrupales` en el seed.js.
