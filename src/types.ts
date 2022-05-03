import type { ComponentType, FC, ComponentProps, ReactNode } from 'react';

type Obj = Record<string, any>;
type EmptyObj = Record<string, never>;
type Component = ComponentType<any>;
type Cast<T, U> = T extends U ? T : U

type ContainerDeclaration = Record<
    string,
    Component | { component: Component, containerProps?: Obj }
>

type DeclarationComponent<Declaration extends ContainerDeclaration, Key extends keyof Declaration> =
    Declaration[Key] extends { component: Component }
        ? Declaration[Key]['component']
        : Declaration[Key]

type DeclarationContainerProps<Declaration extends ContainerDeclaration, Key extends keyof Declaration> =
Declaration[Key] extends { containerProps: any }
    ? Declaration[Key]['containerProps']
    : EmptyObj
    
type ContainerHook<
    Declaration extends ContainerDeclaration,
    ContainerName extends keyof Declaration
> = (props: DeclarationContainerProps<Declaration, ContainerName>) => 
ComponentProps<Cast<DeclarationComponent<Declaration, ContainerName>, Component>>

type CreateContainer<Declaration extends ContainerDeclaration> = <
    ContainerName extends keyof Declaration,
    TargetComponent extends DeclarationComponent<Declaration, ContainerName>,
    Hook extends ContainerHook<Declaration, ContainerName>
>(containerName: ContainerName, component: TargetComponent, containerHook: Hook) => {
    [K in ContainerName]: FC<DeclarationContainerProps<Declaration, ContainerName>>
}

type ContainerProvider<Declaration extends ContainerDeclaration> = FC<{
    children: ReactNode
    mocks: Partial<{
        [K in keyof Declaration]: 
            | ContainerHook<Declaration, K>
            | ComponentProps<Cast<DeclarationComponent<Declaration, K>, Component>>
    }>
}>

export declare function createScope<Declaration extends ContainerDeclaration>(): {
    createContainer: CreateContainer<Declaration>,
    ContainerProvider: ContainerProvider<Declaration>,
}