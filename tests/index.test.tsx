import { createContext, FC, useContext } from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createScope } from '../src';

const Context = createContext({});
const Component: FC = () => null;
const { createContainer, ContainerProvider } = createScope();
const f = () => ({});

describe('createScope', () => {
    it('returns same name as was passed to the hook', () => {
        const result = createContainer('foo', Component, f);

        expect(result).toHaveProperty('foo');
    })
    it('renders component wrapped by container', () => {
        const C: FC = () => <div data-testid='bar' >foo</div>
        const Container = createContainer('CContainer', C, f).CContainer!;

        render(<Container />);

        expect(screen.getByTestId('bar')).toBeInTheDocument();
    })
    it('passes props to component', () => {
        const C: FC = () => <div data-testid='bar' >foo</div>;
        const CMock = jest.fn(C);
        const Container = createContainer('CContainer', CMock, () => ({ foo: 'bar', bar: 'baz' }) ).CContainer!;

        render(<Container />);
        
        expect( CMock.mock.calls[0]?.[0] ).toEqual({ foo: 'bar', bar: 'baz' });
    })
    it('passes params to container hook', () => {
        const C: FC = () => <div data-testid='bar' >foo</div>;
        const CHook =  () => ({ });
        const CHookMock = jest.fn(CHook)
        const Container = createContainer('CContainer', C, CHookMock ).CContainer!;

        render(<Container {...{ foo: 'bar', bar: 'baz' } as any} />);
        
        expect( CHookMock.mock.calls[0]?.[0 as any] ).toEqual({ foo: 'bar', bar: 'baz' });
    })
    it('passes mock props to component', () => {
        const C1: FC = () => <div data-testid='bar' >foo</div>;
        const C2: FC = () => <div data-testid='bar' >foo</div>;

        const C1Mock = jest.fn(C1);
        const Container1 = createContainer('C1Container', C1Mock, () => ({ foo: 'bar', bar: 'baz' }) ).C1Container!;
        const C2Mock = jest.fn(C2);
        const Container2 = createContainer('C2Container', C2Mock, () => ({ foo: 'bar', bar: 'baz' }) ).C2Container!;

        const mocks = { 
            C1Container: () => ({ foo: 'foo', bar: 'bar' }),
            C2Container: ({ foo: 'foo', bar: 'bar' })
        }


        render(
            <ContainerProvider mocks={mocks}>
                <Container1 />
            </ContainerProvider>
        );
        
        expect( C1Mock.mock.calls[0]?.[0] ).toEqual({ foo: 'foo', bar: 'bar' });
    })
    it('passes params to mock container hook', () => {
        const C: FC = () => <div data-testid='bar' >foo</div>;
        const CHook =  () => ({ });
        const CHookMock = jest.fn(CHook)
        const mocks = { CContainer: CHookMock}
        const Container = createContainer('CContainer', C, () => ({ foo: 'foo', bar: 'bar' }) ).CContainer!;

        render(
            <ContainerProvider mocks={mocks}>
                <Container {...{ foo: 'bar', bar: 'baz' } as any} />
            </ContainerProvider>
        );
        
        expect( CHookMock.mock.calls[0]?.[0 as any]  ).toEqual({ foo: 'bar', bar: 'baz' });
    })
    it('renders components', () => {
        const C1: FC<{ prop: string }> = ({ prop }) => <div data-testid={prop} >foo</div>
        const C2: FC<{ prop: string }> = ({ prop }) => <div data-testid={prop} >foo</div>
        const C3: FC<{ prop: string }> = ({ prop }) => <div data-testid={prop} >foo</div>

        const C1Container = createContainer('C1Container', C1, () => ({ prop: 'foo' }) ).C1Container!;
        const C2Container = createContainer('C2Container', C2, () => ({ prop: 'bar' }) ).C2Container!;
        const C3Container = createContainer('C3Container', C3, () => ({ prop: 'baz' }) ).C3Container!;

        render(
            <ContainerProvider mocks={{}} >
                <C1Container />
                <C2Container />
                <C3Container />
            </ContainerProvider>
        );
        
        expect(screen.getByTestId('foo')).toBeInTheDocument();
        expect(screen.getByTestId('bar')).toBeInTheDocument();
        expect(screen.getByTestId('baz')).toBeInTheDocument();
    })
    it('renders mock containers', () => {
        const C1: FC<{ prop: string }> = ({ prop }) => <div data-testid={prop} >foo</div>
        const C2: FC<{ prop: string }> = ({ prop }) => <div data-testid={prop} >foo</div>
        const C3: FC<{ prop: string }> = ({ prop }) => <div data-testid={prop} >foo</div>

        const C1Container = createContainer('C1Container', C1, () => ({ prop: 'foo' }) ).C1Container!;
        const C2Container = createContainer('C2Container', C2, () => ({ prop: 'bar' }) ).C2Container!;
        const C3Container = createContainer('C3Container', C3, () => ({ prop: 'baz' }) ).C3Container!;

        render(
            <ContainerProvider mocks={{
                C1Container: ({ prop: 'foo-mock' }),
                C3Container: () => ({ prop: 'baz-mock' })
            }} >
                <C1Container />
                <C2Container />
                <C3Container />
            </ContainerProvider>
        );
        
        expect(screen.getByTestId('foo-mock')).toBeInTheDocument();
        expect(screen.getByTestId('bar')).toBeInTheDocument();
        expect(screen.getByTestId('baz-mock')).toBeInTheDocument();
    })
})
