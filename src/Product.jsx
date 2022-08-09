import style from './Product.module.css';
import polygonLogo from './img/polygonLogo.png';

export function Product(props) {
    return(
        <div className={style.container}>
            <div className={style.price}>
                <p>{props.content.price}</p>
                <img style={{width: '15px', height: '15px'}} alt='Polygon' className={style.polygon} src={polygonLogo}></img>
            </div>
            <img className={style.image} alt={props.content.name} src={require(`./img/${props.content.id}.png`)}></img>
            <h1>{props.content.name}</h1>
            <h2>{props.content.material}</h2>
        </div>
    );
};