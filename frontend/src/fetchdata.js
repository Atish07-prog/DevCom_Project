import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [ispendingdata, setispendingdata] = useState(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw Error('unable to fetch data');
                }
                return res.json();
            })

            .then((datas) => {
                console.log(datas);
                setData(datas);
                setispendingdata(false);
                seterror(null);

            })
            .catch((err) => {
                seterror(err.message);
                setispendingdata(false);


            })


    }, [url])

    return { data, ispendingdata, error };

}

export default useFetch;





