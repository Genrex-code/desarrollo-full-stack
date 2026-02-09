function card ({titulo,descripcion}) {
    return (
        <div className="card">
            <h3>{titulo}</h3>
            <p>{descripcion}</p>
            <button>Ver más</button>
            </div>
    )
}
export default card;