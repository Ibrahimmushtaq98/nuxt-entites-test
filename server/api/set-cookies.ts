import { defineEventHandler, setCookie, appendHeader  } from "#imports";

export default defineEventHandler((event)=>{

    appendHeader(event, 'Set-Cookie', `myCookieName=myCookieValue; Path=/; HttpOnly; Secure; SameSite=None; Domain=${process.env.COOKIES_DOMAIN}; Max-Age=604800`);
    const rawHeaders = event.node.req.headers;

    return {
        message: 'Cookie has been set!',
        requestHeaders: rawHeaders, // The raw headers from the incoming request
        method: event.node.req.method, // Request method (GET, POST, etc.)
        url: event.node.req.url, // The requested URL
    };
    
    // setCookie(event, "SimpleCookie", "Labourly",{
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'none', // Allows cross-site requests
    //     path: '/', // Cookie is valid across the entire site
    //     domain: '.labourly.ca', // Shared across all subdomains
    //     maxAge: 60 * 60 * 24 * 7, // 7 days
    // })

    //return { message: 'Cookie has been set!' };
})