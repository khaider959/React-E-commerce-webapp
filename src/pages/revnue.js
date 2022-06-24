import React, { useEffect, useState } from "react"
import { db } from "../services/firebase"
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import { FcApproval } from "react-icons/fc";
import { IoIosRemoveCircle } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";
import {
    PieChart,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    LineChart,
    Line,
    Pie,
    Bar,
    CartesianGrid
} from "recharts";



const Revnue = () => {

    const navigate = useNavigate();
    const logout = () => {
        navigate("/welcome");
    }

    const goBack = () => {
        navigate("/salesmanager");
    }


    const [deliveries, setDeliveries] = useState([]);
    const getDeliveries = async () => {
        const deliveries = await db.collection('orders').get();
        const deliveriesArray = [];
        for (var snap of deliveries.docs) {
            var data = snap.data();
            const now = new Date();
            const msBetweenDates = Math.abs(now.getTime() - (data.placement_date.seconds * 1000));
            if ((msBetweenDates / 100000000) < 30) {
                deliveriesArray.push({
                    ...data
                })
            }
        }
        setDeliveries(deliveriesArray);
    }
    useEffect(() => {
        getDeliveries();
    }, [])



    const data = [
        {
            "name": "",
            "Revenue": 725,
            "Profit": 290,
        },
    ]


    // finding total of all orders
    const findingTotal = deliveries.map(total => {
        return total.total_price
    })
    const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;
    const totalValue = findingTotal.reduce(reducerOfQty, 0);





    return (
        <div className="container-fluid">
            <button className="sign-out" onClick={() => goBack()}> <BsArrowLeft size="1rem" /> </button>
            <button className="sign-out" onClick={() => logout()}>Sign Out</button>
            <h1 className="text-center">Revnue the past 30 days: </h1>
            <div className="products-box">
                <>
                    <section class="product2">
                        <div class="product__info">
                            <div class="price2">
                                <span>Revnue: {totalValue} TL</span> <br></br>
                                <span>Profit: {totalValue * 0.4} TL</span>
                            </div>
                        </div>
                    </section>
                </>
                <BarChart width={730} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#8884d8" />
                    <Bar dataKey="Profit" fill="#82ca9d" />
                </BarChart>
            </div>

        </div>
    );
};

export default Revnue;
