# Backend — pendiente

Aquí va el proyecto Spring Boot.

## Cómo generarlo

En https://start.spring.io

- Proyecto: Maven
- Lenguaje: Java
- Spring Boot: 3.x
- Java: 21
- Group: `com.transflow`
- Artifact: `transflow`

Dependencias:

- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- Lombok
- Driver de la base de datos (MySQL o PostgreSQL)
- Spring Boot DevTools

Descargar el ZIP y descomprimir su contenido dentro de esta carpeta,
de modo que quede `backend/pom.xml` y `backend/src/`.

## Capas previstas

```
com.transflow
├── config          seguridad, CORS
├── auth            login, JWT
├── usuario         entity, repository, service, controller, dto
├── ventas
├── marketing
├── logistica
├── almacen
├── produccion
├── operaciones
├── direccion
└── auditoria
```

## Primeros endpoints

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/api/auth/login` | devolver el JWT |
| GET | `/api/auth/me` | datos del usuario en sesión |
| GET | `/api/ventas/oportunidades` | listar |
| POST | `/api/ventas/oportunidades` | crear |

## Nota sobre CORS

Si el frontend se sirve en un puerto distinto (por ejemplo 5500) habrá que
permitir ese origen en la configuración de Spring Security.
