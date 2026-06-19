import {create} from "zustand";
import axios from "@/lib/axios";


export interface License {

    id:number;

    productTitle:string;

    productImage?:string;

    licenseKey:string;

    status:
    | "active"
    | "expired"
    | "revoked";


    version:string;

    planName?:string;


    downloadableFile?:string;


    expiresAt?:string|null;


    daysLeft:number|null;

}



interface LicenseStore {


    licenses:License[];

    loading:boolean;

    total:number;

    currentPage:number;


    fetchLicenses:
    (
        page:number,
        search:string,
        status:string
    )=>Promise<void>;

}



export const useLicenseStore=create<LicenseStore>(
(set)=>({

    licenses:[],

    loading:false,

    total:0,

    currentPage:1,



    fetchLicenses:async(
        page,
        search,
        status
    )=>{


        try{

            set({
                loading:true
            });



            const res =
            await axios.get(
                "/my-licenses",
                {
                    params:{
                        page,
                        search,
                        status
                    }
                }
            );



            set({

                licenses:
                    res.data.data,


                total:
                    res.data.meta.total,


                currentPage:
                    res.data.meta.current_page

            });



        }
        catch(error){

            console.log(error);

        }
        finally{

            set({
                loading:false
            });

        }


    }


}));