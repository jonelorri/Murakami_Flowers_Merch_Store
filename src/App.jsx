import background from './img/background.jpg';
import flower from './img/murakami-flower-original.gif';
import style from './App.module.css';
import {Product} from './Product.jsx';
import { useEffect, useState } from 'react';
import tick from './img/tick.png';
import { ethers } from "ethers";
import abi from "./utils/MerchStore.json";


class product {
    constructor (id, name, material, price) {
        this.id = id;
        this.name = name;
        this.material = material;
        this.price = price;
    }
}

let product1 = new product('1','Emboidered Black Cap', '100% brushed cotton', 39);
let product2 = new product('2','Emboidered Grey Cap', '100% brushed cotton', 39);
let product3 = new product('3','Emboidered White Cap', '100% brushed cotton', 39);

export function App() {
    const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "0xc083f8e9d31da2a6FbA28496e8DB098FF151dD10";
    const contractABI = abi.abi;

    const [shoppingList, setShoppingList] = useState("");
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);
    const [value3, setValue3] = useState(0);

    function increaseValue1 () {
        setValue1(value1 + 1);
        setShoppingList(`Black cap - ${value1 + 1} / Grey cap - ${value2} / White cap - ${value3}`);
    }function decreaseValue1 () {
        if (value1 > 0)
            setValue1(value1 - 1);
            setShoppingList(`Black cap - ${value1 - 1} / Grey cap - ${value2} / White cap - ${value3}`);
    }
    
    function increaseValue2 () {
        setValue2(value2 + 1);
        setShoppingList(`Black cap - ${value1} / Grey cap - ${value2 + 1} / White cap - ${value3}`);
    }function decreaseValue2 () {
        if (value2 > 0)
            setValue2(value2 - 1);
            setShoppingList(`Black cap - ${value1} / Grey cap - ${value2 - 1} / White cap - ${value3}`);
    }
    
    function increaseValue3 () {
        setValue3(value3 + 1);
        setShoppingList(`Black cap - ${value1} / Grey cap - ${value2} / White cap - ${value3 + 1}`);
    }function decreaseValue3 () {
        if (value3 > 0)
            setValue3(value3 - 1);
            setShoppingList(`Black cap - ${value1} / Grey cap - ${value2} / White cap - ${value3 - 1}`);
    }

    function handleClick() {
        document.querySelector('.App_shippingForm__-h624').style.display = "none";
        document.querySelector('.App_formContent__LsuMS').style.display = "block";
        document.querySelector('.App_sendButton__3yLNl').style.display = "block";
        document.querySelector('.App_updateInfo__6KNEu').style.display = "none";
    }

    async function handleClick2() {
        if(value1 > 0 || value2 > 0 || value3 > 0) {
            document.querySelector('.App_shippingForm__-h624').style.display = "block";
            try {
                const { ethereum } = window;
          
                if (ethereum) {
                    console.log({value1}, {value2}, {value3});
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const seedSaleContract = new ethers.Contract(contractAddress, contractABI, signer);
                    
                    let price1 = product1.price * value1 + product2.price * value2 + product3.price * value3;
                    const price = {value: ethers.utils.parseEther(`${price1}`)};
                    const Txn = await seedSaleContract.sendValues(shoppingList, price);
                    console.log("Mining...", Txn.hash);
          
                    await Txn.wait();
                    console.log("Mined -- ", Txn.hash);
                    alert('Pedido realizado con éxito (te llegará en 2-5 días) ✅ Gracias')
                }   else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                alert(error.data.message);
            }
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
          const { ethereum } = window;
    
          if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
          } else {
            console.log("We have the ethereum object", ethereum);
          }

          const accounts = await ethereum.request({ method: "eth_accounts" });
    
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account)
            document.querySelector('.App_loginButton__t9Qrm').style.display = "none";
            document.querySelector('.App_buyButton__O4Jdq').style.display = "block";
          } else {
            console.log("No authorized account found")
          }
        } catch (error) {
          console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
          const { ethereum } = window;
    
          if (!ethereum) {
            alert("You need to download Metamask");
            return;
          }
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
          console.log("Connected", accounts[0]);
          setCurrentAccount(accounts[0]);
          document.querySelector('.App_loginButton__t9Qrm').style.display = "none";
          document.querySelector('.App_buyButton__O4Jdq').style.display = "block";
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    function notification (e) {
        e.preventDefault();
        let osLink = document.querySelector('.osLink').value;
        let name = document.querySelector('.name').value;
        let ethAddress = document.querySelector('.ethAddress').value;
        let street = document.querySelector('.street').value;
        let city = document.querySelector('.city').value;
        let region = document.querySelector('.region').value;
        let postal = document.querySelector('.zip').value;
        let country = document.querySelector('.country').value;
  
        if (!name || !ethAddress || !street || !city || !region || !country || !postal) {
          alert('Error. All fields are required');
        }
        else {
          fetch('https://sheet.best/api/sheets/18415df0-3a54-46ca-9704-d46c1c0a5cfa', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "NOMBRE_Y_APELLIDO": name,
                "ETH_ADDRESS": ethAddress,
                "CALLE": street,
                "CIUDAD": city,
                "PROVINCIA": region,
                "PAIS": country,
                "CODIGO_POSTAL": postal,
                "OS_LINK": osLink,
            })
          });
          document.querySelector('.App_formContent__LsuMS').style.display = "none";
          document.querySelector('.App_sendButton__3yLNl').style.display = "none";
          document.querySelector('.App_updateInfo__6KNEu').style.display = "block";
        }
    };

    return(
        <div>
            <div className={style.message}>
                <h3>Nonprofit Website (we only cover operating costs)</h3>
            </div>
            <header style={{backgroundImage: `url(${background})`}} className={style.header}>
                <div className={style.headerContent}>
                    <div className={style.titles}>
                        <h1>MURAKAMI FLOWERS</h1>
                        <h3>Unnoficial Merch Store</h3>
                    </div>
                    <img alt='flower' className={style.flower} src={flower}></img>
                </div>
            </header>
            <div className={style.container}>
                <div>
                    <Product content={product1}/>
                    <form>
                        <div className={style.valueButton} id={style.decrease} onClick={decreaseValue1} value="Decrease Value">-</div>
                        <input readOnly type="number" id={style.number} value={value1} />
                        <div className={style.valueButton} id={style.increase} onClick={increaseValue1} value="Increase Value">+</div>
                    </form>
                </div>
                <div>
                    <Product content={product2}/>
                    <form>
                        <div className={style.valueButton} id={style.decrease} onClick={decreaseValue2} value="Decrease Value">-</div>
                        <input readOnly type="number" id={style.number} value={value2} />
                        <div className={style.valueButton} id={style.increase} onClick={increaseValue2} value="Increase Value">+</div>
                    </form>
                </div>
                <div>
                    <Product content={product3}/>
                    <form>
                        <div className={style.valueButton} id={style.decrease} onClick={decreaseValue3} value="Decrease Value">-</div>
                        <input readOnly type="number" id={style.number} value={value3} />
                        <div className={style.valueButton} id={style.increase} onClick={increaseValue3} value="Increase Value">+</div>
                    </form>
                </div>
            </div>
            <button onClick={connectWallet} className={style.loginButton}>LOGIN</button>
            <button onClick={handleClick2} className={style.buyButton}>BUY</button>
            <div className={style.shippingForm}>
                <header>Shipping Form</header>
                <button className={style.shippingFormButton} onClick={handleClick}><p>X</p></button>
                <form className={style.formContent}>
                    Opensea Link to your MK flower
                    <input className='osLink' defaultValue="If you keep this empty, we will print you the default flower"></input>
                    Full Name
                    <input className='name'></input>
                    Polygon Address
                    <input className='ethAddress' value={currentAccount}></input>
                    Street Address
                    <input className='street'></input>
                    <div className={style.format4}>
                        <div className={style.formContentHalf}>
                            City
                            <input className='city'></input>
                            Region
                            <input className='region'></input>
                        </div>
                        <div className={style.formContentHalf}>
                            Postal / Zip Code
                            <input className='zip'></input>
                            Country
                            <input className='country'></input>
                        </div>
                    </div>
                </form>
                <button onClick={notification} className={style.sendButton}>SEND</button>
                <div className={style.updateInfo}>
                    <img alt='tick' src={tick}></img>
                    <h2>Correctly updated</h2>
                </div>
            </div>
            <footer>
                <p>If you need further assistance, please contact with <b>vulturefxtrading@gmail.com</b></p>
            </footer>
        </div>
    );
};