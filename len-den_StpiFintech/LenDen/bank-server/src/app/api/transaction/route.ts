import { NextRequest, NextResponse } from 'next/server';

// Define an interface for the account structure
interface Account {
    account_holder?: string;
    account_number: string;
    ifsc: string;
    cc_num: string;
    dc_num: string;
    cvv: string;
    expiry: string;
    UPI: string;
    OTP: string;
    NB_username: string;
    NB_password: string;
    balance: number;
}

// Define user_account and customer_account as Account types
const user_account: Account = {
    account_holder: "user",
    account_number: "23122204240",
    ifsc: "LENDEN00010",
    cc_num: "2211332244335544",
    dc_num: "4455334422331122",
    cvv: "772",
    expiry: "11/27",
    UPI: "user@lenden",
    OTP: "111000",
    NB_username: "useracc",
    NB_password: "user@123456",
    balance: 20000
};

const customer_account: Account = {
    account_holder: "customer",
    account_number: "100020000",
    ifsc: "LENDEN01101",
    cc_num: "100000200000",
    dc_num: "200000100000",
    cvv: "772",
    expiry: "11/27",
    UPI: "customer@lenden",
    OTP: "111000",
    NB_username: "customeracc",
    NB_password: "customer@123456",
    balance: 10000
};

// Define a detailed TransactionBody interface
interface TransactionBody {
    account_number: string;
    ifsc: string;
    transaction_type: "DEBIT" | "CREDIT";
    orderAmount: number;
    payment_method?: "DEBITCARD" | "CREDITCARD" | "UPI" | "NETBANKING";
    dc_num?: string;
    cc_num?: string;
    expiry?: string;
    cvv?: string;
    OTP?: string;
    UPI?: string;
    UPI_SUCCESS?: boolean;
    NB_username?: string;
    NB_password?: string;
}

// Identify account based on account number
function identify_account(body: TransactionBody): Account | null {
    if (body.cc_num === user_account.cc_num || body.dc_num === user_account.dc_num || body.UPI === user_account.UPI || body.NB_username === user_account.NB_username || body.account_number === user_account.account_number) {
        return user_account;
    } else if (body.cc_num === customer_account.cc_num || body.dc_num === customer_account.dc_num || body.UPI === customer_account.UPI || body.NB_username === customer_account.NB_username || body.account_number === customer_account.account_number) {
        return customer_account;
    }
    return null;
}

export async function POST(req: NextRequest) {
    // Read the request body only once
    const body = await req.json() as TransactionBody;

    // Validate required fields in the body
    if (!body.transaction_type || (!body.NB_username && !body.UPI && !body.dc_num && !body.cc_num && (!body.account_number || !body.ifsc)) || !body.orderAmount) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Call the appropriate handler based on the transaction type
    if (body.transaction_type === "DEBIT") {
        return handleDebit(body);
    } else if (body.transaction_type === "CREDIT") {
        return handleCredit(body);
    } else {
        return NextResponse.json({ message: "Invalid transaction type" }, { status: 400 });
    }
}

// Handle debit transaction logic
function handleDebit(body: TransactionBody) {
    const account = identify_account(body);
    
    if (!account) {
        return NextResponse.json({ message: "Account does not exist" }, { status: 404 });
    }

    const { payment_method, orderAmount, dc_num, cc_num, expiry, cvv, OTP, UPI, UPI_SUCCESS, NB_username, NB_password } = body;

    // Check for sufficient balance in the account before debiting
    if (orderAmount <= account.balance) {
        if (payment_method === "DEBITCARD" || payment_method === "CREDITCARD") {
            const cardNum = payment_method === "DEBITCARD" ? dc_num : cc_num;

            if (cardNum === account[payment_method === "DEBITCARD" ? "dc_num" : "cc_num"] &&
                expiry === account.expiry && cvv === account.cvv && OTP === account.OTP) {
                account.balance -= orderAmount; // Deduct from account
                return NextResponse.json({ success: true, message: "Transaction Successful", account }, { status: 200 });
            }
        } else if (payment_method === "UPI") {
            if (UPI === account.UPI && UPI_SUCCESS) {
                account.balance -= orderAmount; // Deduct from account
                return NextResponse.json({ success: true, message: "Transaction Successful", account }, { status: 200 });
            }
        } else if (payment_method === "NETBANKING") {
            if (NB_username === account.NB_username && NB_password === account.NB_password) {
                account.balance -= orderAmount; // Deduct from account
                return NextResponse.json({ success: true, message: "Transaction Successful", account }, { status: 200 });
            }
        }
    } else {
        return NextResponse.json({ message: "Transaction failed, due to insufficient balance" }, { status: 400 });
    }

    return NextResponse.json({ message: "Invalid account details or payment method" }, { status: 400 });
}

// Handle credit transaction logic
function handleCredit(body: TransactionBody) {
    const account = identify_account(body);
    
    if (!account) {
        return NextResponse.json({ message: "Account does not exist" }, { status: 404 });
    }

    const { account_number, ifsc, orderAmount } = body;

    // Validate account and ifsc for crediting
    if (account_number === account.account_number && ifsc === account.ifsc) {
        account.balance += orderAmount; // Add to account
        return NextResponse.json({ success: true, message: "Transaction Successful", account }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Transaction failed, wrong credentials provided" }, { status: 400 });
    }
}

export async function GET() {
    // Initialize accounts with balance
    const merchantAccount = {
        name: "Merchant",
        balance: user_account.balance,
    };

    const customerAccount = {
        name: "Customer",
        balance: customer_account.balance,
    };

    return NextResponse.json({
        merchant: merchantAccount,
        customer: customerAccount
    });
}
