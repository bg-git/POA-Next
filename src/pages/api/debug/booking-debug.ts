import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Test case from calendar logic
  const dateAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return res.status(200).json({
    now: now.toISOString(),
    today_with_time: today.toISOString(),
    dateAtMidnight: dateAtMidnight.toISOString(),
    isPastDate: dateAtMidnight < now,
    currentHour: now.getHours(),
    currentMinutes: now.getMinutes(),
    message: "If isPastDate is true, that means today is marked as past due to time comparison bug"
  });
}
