import express from "express"
import vacunasRoutes from "./routes/vacunas.routes.js"
import vacunasApiRoute from "./api/routes/vacunas.api.routes.js"
import DashboardRoutes from "./routes/dashboard.routes.js"
import UsuariosApiRoutes from "./api/routes/usuarios.api.routes.js"
import userAppApiRoutes from "./api/routes/userApp.api.routes.js"
import gruposApiRoutes from "./api/routes/grupo.api.routes.js"
import cors from "cors"


const app = express()

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
};

app.use(cors(corsOptions));

app.use( express.urlencoded({extended: true}) )
app.use( express.json() )

app.use("/", DashboardRoutes)
app.use( "/vacunas", vacunasRoutes )
app.use( "/api/vacunas", vacunasApiRoute )
app.use( "/api/usuarios", UsuariosApiRoutes )

app.use("/api/userApp", userAppApiRoutes)
app.use("/api/grupos", gruposApiRoutes)

app.use( express.static("public") )


app.listen(3333, () => {
    console.log("funcionando")
})