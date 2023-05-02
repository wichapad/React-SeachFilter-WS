import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [countries, setCountries] = useState([]) //state เก็บข้อมูลแต่ละประเทศ
  const [word, setWord] = useState("") // state เก็บเอาคำที่ผู้ใช้ กรอกใน search
  const [dataFilter] = useState(["name", "capital"]) //state กำหนดเงื่อนไขเพื่อที่จะค้นหาได้ทั้งประเทศและเมืองหลวง

  useEffect(() => { //เมื่อเปิดแอพ จะให้ทำการดึงข้อมูล Api ทันที
    fetch("https://restcountries.com/v3.1/all") //ขอข้อมูลจาก web restcountries.com
      .then(res => res.json()) // reponse ข้อมูล เป็น json
      .then(data => {  // แปลงเป็นข้อมูลที่อ่านได้ ข้อมูลเป็นรูปแบบ object ซึ่งเก็บอยู่ใน array data
        setCountries(data);
      })
  }, [])

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const searchCountries = (countries) => { //function สำหรับค้นหาข้อมูลทุกๆประเทศ โดยจะค้นผ่าน ชื่อประเทศ หรือ ชื่อเมืองหลวงก็ได้
    return countries.filter((item) => { // กรองข้อมูลสมาชิกตามเงื่อนไขที่กำหนด
      // eslint-disable-next-line
      return dataFilter.some((filter) => {
        if (item[filter]) { //ถ้ามีข้อมูล อยู่ในช่อง item.filter จะให้ return
          if (filter === "name") { //ถ้าเป็นจริง จะขึ้นชื่อประเทศที่ทำการค้นหา
            return (
              item[filter].common
                .toString() //แปลงข้อมูลเป็น String
                .toLowerCase() //ทำให้เป็นตัวพิมพ์เล็ก
                .indexOf(word.toLowerCase()) > -1
            )
          } else { //ถ้าไม่เป็นจริง จะทำการค้นเมืองหลวง
            return (
              item[filter]
                .toString()
                .toLowerCase()
                .indexOf(word.toLowerCase()) > -1
            );
          }
        }
      })
    })
  }

  return (
    <div className='container' >
      <div className='search_container'>
        <label htmlFor='seach_form'>
          <input
            type="text"
            className='search_input'
            placeholder='Do You Want Seach Countries? (Country,Capital)'
            value={word} //เก็บคำที่พิมพ์
            onChange={(e) => setWord(e.target.value)} //เก็บคำที่พิมพ์ลงใน state word
          />
        </label>
      </div>
      <ul className='row'>
        {searchCountries(countries).map((item, index) => { //map ข้อมูลมาแสดงผล
          return (
            <li key={index}>
              <div className='card'>
                <div className='card_title'>
                  <img src={item.flags.png} alt={item.name.common} />
                </div>
                <div className='card_body'>

                  <div className='card_desciption'>
                    <h2>{item.name.common} </h2>
                    <ol className='card_list'>
                      <li>population : <span>{formatNumber(item.population)}</span> </li>
                      <li>Region : <span>{item.region}</span> </li>
                      <li>Capital : <span>{item.capital}</span> </li>
                    </ol>
                  </div>
                </div>
              </div>
            </li>



          )

        })}
      </ul>
    </div>
  );
}

export default App;
