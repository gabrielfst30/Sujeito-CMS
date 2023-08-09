import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

//pega todas as propriedades do componente Link
interface ActiveLinkProps extends LinkProps{
    children: ReactElement;
    activeClassName: string;
}


export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps){
    const { asPath } = useRouter();

    //se a rota/pagina que estamos acessando for igual ao link clicado, então ativamos a classname
    const className = asPath === rest.href ? activeClassName : '';
    
    
    return(
        <Link {...rest}>
            {cloneElement(children, {
                className
            })}
        </Link>
    )
}