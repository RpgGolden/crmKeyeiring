import { useEffect, useState } from "react";
import ServiseCard from "../../ui/ServiseCard/ServiseCard";
import styles from "./ServiseModule.module.scss";
import { use } from "react";
import { CreateService, GetAllService } from "../../API/ApiReguest";
import DataContext from "../../context";
import { useContext } from "react";
import PopUpCreateService from "../../components/PopUp/PopUpCreateService/PopUpCreateService";
import PopUpEditService from "../../components/PopUp/PopUpEditService/PopUpEditService";

function ServiseModule() {
    const [service, setService] = useState([]);
    const context = useContext(DataContext);
    useEffect(() => {
        GetAllServiceFunc();
    }, [])

    const GetAllServiceFunc = () =>{
        GetAllService().then((resp)=>{
            if(resp?.status === 200){
                console.log("resp", resp.data)
                setService(resp.data)
            }
        })
    }
    
    const CreateService = () => {
        context.setVizibleePopUp("createService")
    }
    return ( 
        <div className={styles.ServiseModuleContainer}>
            <div className={styles.ServiseModule}>
                {service.length === 0 ? <p>Услуги не найдены</p> :
                    (
                        service?.map((item, index) => <ServiseCard key={index} item={item} GetAllService={GetAllServiceFunc}/>) 
                    )
                }
                <div className={styles.createServise} onClick={() => {CreateService()}}>
                    <p>+</p>
                </div>
                {
                    context.vizibleePopUp === "createService" &&  <PopUpCreateService GetAllService={GetAllServiceFunc}/>
                }
                {
                    context.vizibleePopUp === "PopUpEditService" &&  <PopUpEditService GetAllService={GetAllServiceFunc}/>
                }
            </div>
        </div>
     );
}

export default ServiseModule;