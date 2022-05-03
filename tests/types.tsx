import { FC } from 'react';
import { createScope } from '../src/types';

{
    createScope<{  }>();
    createScope<{ C: FC }>();
    createScope<{ C: { component: FC } }>();
    createScope<{ C: { component: FC, containerProps: { foo: 'bar' } } }>();
    createScope<{ 
        C1: FC ,
        C2: { component: FC },
        C3: { component: FC, containerProps: { foo: 'bar' } },
    }>();

    /* @ts-expect-error */
    createScope<{ C: null }>();
    /* @ts-expect-error */
    createScope<{ C: { component: {} } }>();
    /* @ts-expect-error */
    createScope<{ C: { component: FC, containerProps: null} }>();
}
{
    const { createContainer } = createScope<{ 
        C1: FC<{ foo: string }> ,
        C2: { component: FC },
        C3: { component: FC<{ bar: string }>, containerProps: { foo: string } },
    }>();
    
    createContainer('C1', ({ foo }) => null, () => ({ foo: 'foo' }));
    createContainer('C2', ({ }) => null, () => ({ }));
    createContainer('C3', ({ bar }) => null, ({ foo }) => ({ bar: 'bar' }));
    /* @ts-expect-error */
    createContainer('C4', ({ foo }) => null, () => ({ foo: 'foo' }));
    /* @ts-expect-error */
    createContainer('C3', null, () => ({ foo: 'foo' }));
    /* @ts-expect-error */
    createContainer('C1', ({ bar }) => null, () => ({ foo: 'foo' }));
    /* @ts-expect-error */
    createContainer('C1', ({ foo }) => null, () => ({ }));
    /* @ts-expect-error */
    createContainer('C1', ({ foo }) => null, () => ({ baz: 'foo' }));
    /* @ts-expect-error */
    createContainer('C3', ({ bar }) => null, ({ baz }) => ({ bar: 'bar' }));
    /* @ts-expect-error */
    createContainer('C2', ({ }) => null, null);
    const { C3 } = createContainer('C3', ({ bar }) => null, ({ foo }) => ({ bar: 'bar' }));
    /* @ts-expect-error */
    const { C4 } = createContainer('C3', ({ bar }) => null, ({ foo }) => ({ bar: 'bar' }));
}
{
    const { createContainer } = createScope<{ 
        C1: FC<{ foo: string }> ,
        C2: { component: FC },
        C3: { component: FC<{ bar: string }>, containerProps: { foo: string } },
    }>();

    const { C1 } = createContainer('C1', () => null, () => ({ foo: 'bar' }));
    const { C2 } = createContainer('C2', () => null, () => ({ foo: 'bar' }));
    const { C3 } = createContainer('C3', () => null, () => ({ bar: 'bar' }));

    <C1  />;
    <C2 />;
    <C3 foo='bar' />;
    /* @ts-expect-error */
    <C1 foo={'bar' as any} />;
    /* @ts-expect-error */
    <C3 />;
    /* @ts-expect-error */
    <C3 baz='bar' />;
    /* @ts-expect-error */
    <C3 foo='bar' baz='foo' />;
}
{
    const { ContainerProvider } = createScope<{ 
        C1: FC<{ foo: string }> ,
        C2: { component: FC },
        C3: { component: FC<{ bar: string }>, containerProps: { foo: string } },
    }>();

    <ContainerProvider mocks={{}} >
        <div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{}} >
        <div>123</div>
        <div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{}} >
    </ContainerProvider>;
    <ContainerProvider mocks={{}} >
        {/* @ts-expect-error */}
        {new Promise()}
    </ContainerProvider>;

    <ContainerProvider mocks={{
        C1: () => ({ foo: 'bar' }),
        C2: () => ({  }),
        C3: () => ({ bar: 'foo' })
    }} >
    <   div>123</div>
    </ContainerProvider>;
       <ContainerProvider mocks={{
        C1: ({ foo: 'bar' }),
        C2: ({  }),
        C3: ({ bar: 'foo' })
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        C1: () => ({ foo: 'bar' }),
        C2: () => ({  }),
        C3: () => ({ bar: 'foo' })
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        C1: () => ({ foo: 'bar' }),
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        C2: () => ({  }),
        C3: () => ({ bar: 'foo' })
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        C2: () => ({  }),
        C3: ({ foo }) => ({ bar: foo })
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{}} >
        <div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        C1: () => ({ foo: 'bar' }),
        C2: () => ({  }),
        C3: () => ({ bar: 'foo' }),
        /* @ts-expect-error */
        C4: () => ({}),
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        /* @ts-expect-error */
        C1: () => ({}),
    }} >
    <   div>123</div>
    </ContainerProvider>;
    <ContainerProvider mocks={{
        C2: () => ({  }),
        /* @ts-expect-error */
        C3: ({ baz }) => ({ bar: baz })
    }} >
    <   div>123</div>
    </ContainerProvider>;

}