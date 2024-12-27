import { useEffect, useState } from "react";
import ServiseCard from "../../ui/ServiseCard/ServiseCard";
import styles from "./ServiseModule.module.scss";
import { use } from "react";
import { GetAllService } from "../../API/ApiReguest";

function ServiseModule() {
    const [service, setService] = useState([]);

    useEffect(() => {
        GetAllService().then((resp)=>{
            if(resp?.status === 200){
                console.log("resp", resp.data)
                setService(resp.data)
            }
        })
    }, [])
    
    return ( 
        <div className={styles.ServiseModule}>
            {service.length === 0 ? <p>Услуги не найдены</p> :
                (
                    service?.map((item, index) => <ServiseCard key={index} item={item}/>) 
                )
            }
            <div className={styles.createServise}>
                <p>+</p>
            </div>
        </div>
     );
}

export default ServiseModule;