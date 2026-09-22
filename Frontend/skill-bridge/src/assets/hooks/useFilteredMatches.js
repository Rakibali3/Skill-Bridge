import { useMemo } from "react";
import { getAvatarUrl } from "../utils/avatar";

export const HIGH_MATCH_THRESHOLD = 80;

export const MATCH_FILTERS = {
    ALL: "ALL",
    HIGH: "HIGH",
    TEACH_ME: "TEACH_ME",
    I_CAN_TEACH: "I_CAN_TEACH",
};

export const MATCH_SORT_OPTIONS = {
    SCORE: "match",
    NAME: "name",
};

// Converts a raw backend match record into the shape the UI renders.
function toMatchViewModel(match) {
    const name = match.userName || "Anonymous User";

    return {
        id: match.userId,
        name,
        role: match.experience || "Skill Exchange Partner",
        location: match.location || "Location not specified",
        match: Math.round(match.matchScore || 0),
        avatar: getAvatarUrl(name, match.avatarUrl),
        canTeach: match.canTeach || [],
        wantsToLearn: match.wantsToLearn || [],
    };
}

function matchesSearchQuery(match, query) {
    if (!query) return true;

    return (
        match.name.toLowerCase().includes(query) ||
        match.role.toLowerCase().includes(query) ||
        match.location.toLowerCase().includes(query) ||
        match.canTeach.some((skill) => skill.toLowerCase().includes(query)) ||
        match.wantsToLearn.some((skill) => skill.toLowerCase().includes(query))
    );
}

function matchesActiveFilter(match, filter) {
    switch (filter) {
        case MATCH_FILTERS.HIGH:
            return match.match >= HIGH_MATCH_THRESHOLD;
        case MATCH_FILTERS.TEACH_ME:
            return match.canTeach.length > 0;
        case MATCH_FILTERS.I_CAN_TEACH:
            return match.wantsToLearn.length > 0;
        case MATCH_FILTERS.ALL:
        default:
            return true;
    }
}

function sortMatches(matches, sortBy) {
    const sorted = [...matches];

    if (sortBy === MATCH_SORT_OPTIONS.NAME) {
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted.sort((a, b) => b.match - a.match);
}


export function useFilteredMatches(rawMatches, { search, activeFilter, sortBy }) {
    const matches = useMemo(() => rawMatches.map(toMatchViewModel), [rawMatches]);

    return useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = matches.filter(
            (match) =>
                matchesSearchQuery(match, query) && matchesActiveFilter(match, activeFilter)
        );

        return sortMatches(filtered, sortBy);
    }, [matches, search, activeFilter, sortBy]);
}