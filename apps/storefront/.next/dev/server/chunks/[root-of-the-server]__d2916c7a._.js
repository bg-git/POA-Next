module.exports = [
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@supabase/supabase-js", () => require("@supabase/supabase-js"));

module.exports = mod;
}),
"[project]/apps/storefront/src/pages/api/booking/availability.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, cjs)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://dojmhdzpjycbjggclqsl.supabase.co") || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__cjs$29$__["createClient"])(supabaseUrl, supabaseKey);
const LOCATION_MAP = {
    chesterfield: 'Chesterfield',
    leicester: 'Leicester'
};
const OPERATING_HOURS = [
    {
        time: '09:00 AM',
        slots: 2
    },
    {
        time: '10:00 AM',
        slots: 2
    },
    {
        time: '11:00 AM',
        slots: 2
    },
    {
        time: '02:00 PM',
        slots: 2
    },
    {
        time: '03:00 PM',
        slots: 2
    },
    {
        time: '04:00 PM',
        slots: 1
    }
];
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    const { location } = req.query;
    if (!location || typeof location !== 'string') {
        return res.status(400).json({
            error: 'Location parameter required'
        });
    }
    if (!LOCATION_MAP[location]) {
        return res.status(400).json({
            error: 'Invalid location'
        });
    }
    try {
        const locationName = LOCATION_MAP[location];
        const availabilities = [];
        // Generate 30 days from today
        for(let i = 0; i < 30; i++){
            const date = new Date();
            date.setDate(date.getDate() + i);
            // Skip Sundays
            if (date.getDay() === 0) continue;
            const dateStr = date.toISOString().split('T')[0];
            // Get booked slots for this date
            const { data: bookings, error: fetchError } = await supabase.from('bookings').select('appointment_time, slots_booked').eq('location', locationName).eq('appointment_date', dateStr).eq('status', 'confirmed');
            if (fetchError) throw fetchError;
            // Calculate available slots per time
            const bookedByTime = {};
            if (bookings) {
                bookings.forEach((booking)=>{
                    bookedByTime[booking.appointment_time] = (bookedByTime[booking.appointment_time] || 0) + (booking.slots_booked || 1);
                });
            }
            const spots = OPERATING_HOURS.map((hour)=>({
                    start_time: hour.time,
                    formatedTime: hour.time,
                    slots: hour.slots - (bookedByTime[hour.time] || 0)
                })).filter((slot)=>slot.slots > 0);
            availabilities.push({
                date: dateStr,
                available: spots.length > 0,
                spots
            });
        }
        return res.status(200).json({
            success: true,
            location: locationName,
            availabilities
        });
    } catch (error) {
        console.error('Availability fetch error:', error);
        return res.status(500).json({
            error: 'Failed to fetch availability',
            details: error instanceof Error ? error.message : ''
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d2916c7a._.js.map