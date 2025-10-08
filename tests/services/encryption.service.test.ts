import { AlgorithEncryp, AlgorithDecrypt } from '../../src/services/encryption.service';


describe('Encryption and Decryption', () => {

    const publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArNMa/kKy42bptMIhyCpPLqH8mvQVZCHH9IHYtzkUsdciyEH2rP4Qd8ISyHcTuhQ+MdWe1mHSsrr4Wyz0GS46nkbdNmIxx1iLnoFSE+lWwAgHvZ44mwe9a/uVTr+phBd/VXpwY5mORoIRCQBI0uYuznDO+wHTuuUupMJgo/8ujyOPld6KmM5VPV8CnJIiCJFA+v6mzpUZOpLp9cWk8UNya3MWFg5TrC98s4U0rrf3Im5lIk4Wc1Vnc0SlpOdjQ/wy/Vb47OaeOcxfMdZZtf13L16lymi26a/cTR2sqkP4nLvMPhvK8FEOQKDg8TrdkXzfN2/xmOiWDq3v1/KwYtojJwIDAQAB";
    const privateKey = "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCs0xr+QrLjZum0wiHIKk8uofya9BVkIcf0gdi3ORSx1yLIQfas/hB3whLIdxO6FD4x1Z7WYdKyuvhbLPQZLjqeRt02YjHHWIuegVIT6VbACAe9njibB71r+5VOv6mEF39VenBjmY5GghEJAEjS5i7OcM77AdO65S6kwmCj/y6PI4+V3oqYzlU9XwKckiIIkUD6/qbOlRk6kun1xaTxQ3JrcxYWDlOsL3yzhTSut/cibmUiThZzVWdzRKWk52ND/DL9Vvjs5p45zF8x1lm1/XcvXqXKaLbpr9xNHayqQ/icu8w+G8rwUQ5AoODxOt2RfN83b/GY6JYOre/X8rBi2iMnAgMBAAECggEAZzmQHd3oyzpkzLpHQy9CLDBEmKjBPhWPQNNthcJqQe6lr8b2d00ouN8KKQI2niYJH+rf/FxhZK+YN50aDxA1ouPgrOLpqI+SlRHY3Fu6nOgu92rRlIeC9ERIYcjIj0UZoQyIpHTLLgHx+tZYqN8jhdqLRhFJTZAl0/Lllg6M2KEBlVzdvehyHqvB63WrAClTVF04nQs4uAfDqHFeYIddMOlYxyRu2WcX7niNWCZvNE/qBGg4tIgDMO0Wfs0p1qTn0kg1EQN0RuI4Rt1SwiN26k2CXVgcNL9FVnURJP+dg2WYGP7so8eOhFD92pW5x8zV5GG959mAw4g6kNe/on8OwQKBgQDSYJ1YxwWOriGVtMUlmyGZznUpT/2am5zIiTo/lokKwD70n98g7JhwEPgSp5eYEHr5X38CxI8mOAo/jHP2tnwfYkhHgBmPF0uIUO6XEv6da+acU3+rIxpZblGs0KwdZfgJU3ompKL6mCt5ZiuIgPiFvinik34X/U1MXKH4JJkWMwKBgQDSTbK1Om93P6z3jsFhk1bvcUgO4D9ZxEMe9rAUZ0y0oRAtEsuYQz1dYU44QlPbrXNad5xl5eol3K9I4C7u9fBCiq5geoFezWOZIl90/3S4Syg4EAijDWbu33YX2ebyefmgtW3Bk7JaG3XcdEcGLsRMmFqa9z3BUWkFrbx+uq3DPQKBgQCj3sARzA0nI7pja4j5jwowTWJzyKwphzcr+cCWkYK0DiW71OAwPDtNZ9pkZYku2P+BSgKcPFGpGpPZBmW58lFi/OKCV2URUbrzNt9ybEhKhSb/9AaJXvGCYe1a6Lx4tdnsIcsPWMTe4DNU/+G/FX8AZq0noW3h79wLNEiyCof4gwKBgQCrpHC0C2KIcHcKggABVJEC0nFeetYZvN6PegXSUVFAp6gdMZbryg1elpmRv0jUJefdMXx7ikAl8M07bIXB0QbsOGYEJlhKeNXOWUiRpCGufODxiNyTv8+ALPAknVsqEjWUXh+be6F4e6shZ+HEAQ2D+mEQ07QagQh3cwpCYLiLfQKBgQCO4fAo8lWInGjRB/dXqTs/G/s7zF6t/S1qi/0mGZUZkLurCLw7EN3NCYl87xlSh0hTNDoGTgHyY1DhYETtmKjvSc3FnJ9IbE/yDloeEzbwc4y/lWNSLrEwKaIP8JFJfYW5LzO91aMe4NzJD5yn21R2jo3nHyC8U8CD04DT/GnEbQ==";

    const testData = 'Test data for encryption';

    it('should encrypt data correctly', () => {
        const encryptedData = new AlgorithEncryp(publicKey);
        expect(typeof encryptedData.data(testData)).toBe('string');
        expect(encryptedData.data(testData)).not.toBe(testData);
    });

    it('should decrypt data correctly', () => {
        const encryptedData = new AlgorithEncryp(publicKey);
        const textEncryp=  encryptedData.data(testData)
        const decryptedData = new AlgorithDecrypt(privateKey);
        const textDecryp=  decryptedData.data(textEncryp)
        expect(textDecryp).toBe(testData);
    });
});