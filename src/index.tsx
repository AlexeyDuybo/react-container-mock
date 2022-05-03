import { FC, ComponentType, ComponentProps, Context, useContext, createContext, PropsWithChildren } from 'react';

type Obj = Record<string, any>;
type ContainerHook = (params?: Obj) => Obj;
type ContextValue = Record<string, ContainerHook | Obj>;
type ContainerContext = Context<ContextValue>;

const createContainer = (mockContext: ContainerContext) => 
(containerName: string, Component: ComponentType<any>, containerHook: ContainerHook) => {
    const Container: FC = (containerProps) => {
        const useMockPropsOrObject = useContext(mockContext)[containerName];

        const props = typeof useMockPropsOrObject === 'object'
            ? useMockPropsOrObject
            : (useMockPropsOrObject || containerHook)(containerProps)

        return <Component {...props} />
    }

    return {
        [containerName]: Container
    }
}

type ContainerProviderProps = PropsWithChildren<{
    mocks: ContextValue,
}>

const createContainerProvider = (ContainerContext: ContainerContext) => {
    const ContainerProvider: FC<ContainerProviderProps> = ({ mocks, children }) => {
        return (
            <ContainerContext.Provider value={mocks} >
                {children}
            </ContainerContext.Provider>
        )
    }
    return ContainerProvider;
}

export const createScope = () => {
    const ContainerContext: ContainerContext = createContext({});
    return {
        createContainer: createContainer(ContainerContext),
        ContainerProvider: createContainerProvider(ContainerContext)
    }
}