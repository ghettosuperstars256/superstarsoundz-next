import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword, updateUserPassword, updateUserEmail } from '@/lib/users';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { currentPassword, newPassword, newEmail } = body;

    // Verify current password
    const user = await findUserByEmail(admin.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const valid = await validatePassword(user, currentPassword);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const results: string[] = [];

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
      }
      await updateUserPassword(user.id, newPassword);
      results.push('Password updated');
    }

    if (newEmail && newEmail !== user.email) {
      await updateUserEmail(user.id, newEmail);
      results.push('Email updated');
    }

    return NextResponse.json({ success: true, message: results.join(', ') || 'No changes made' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
