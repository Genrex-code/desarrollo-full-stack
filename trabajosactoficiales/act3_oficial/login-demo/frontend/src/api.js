import { useState } from "react";
import Login from "./components/Login";

export default function App(){

  const [user,setUser] = useState(null);

  return(
    <div>

      {!user ? (

        <Login onLogin={(d)=>{
          if(d.full_name){
            setUser(d);
          }
        }}/>

      ) : (

        <h1>Bienvenido {user.full_name}</h1>

      )}

    </div>
  );
}
