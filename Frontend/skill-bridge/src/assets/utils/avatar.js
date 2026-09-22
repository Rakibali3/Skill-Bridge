const DEFAULT_AVATAR_BACKGROUND = "6366f1";

/**
 * Returns a usable avatar URL for a user: their own avatar if set,
 * otherwise a generated ui-avatars.com placeholder from their name.
 */
export function getAvatarUrl(name, avatarUrl) {
    if (avatarUrl) return avatarUrl;

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "User"
    )}&background=${DEFAULT_AVATAR_BACKGROUND}&color=fff`;
}