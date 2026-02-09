import navbar from "./components/navbar";
import menu from "./src/components/Menu";
import card from "./src/components/card";
import footer from "./src/components/footer";


//nota waos 
function App() {
    return (
        <div>
            <Navbar />
            <div className="container">
                <main>
                    <h1>Bienvenidos a mi sitio</h1>
                    <div className="cards">
                        <Card titulo="producto1" descripcion="ejemplo" />
                        <Card titulo="producto2" descripcion="ejemplo" />
                        <Card titulo="producto3" descripcion="ejemplo" />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default App;