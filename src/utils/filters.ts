import * as mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

function getReleaseBranchFilter(release, historyTillBranchId?) {
    release.parent_releases.reverse(); // So that master comes at the bottom.
    const ancRelease = release.parent_releases;
    let branchTreeFilter = [];

    ancRelease.some((anc_release, index) => {
        if (historyTillBranchId && anc_release.release_ref.id === historyTillBranchId) {
            return true;
        }
        const createdAt = !index ? release.createdAt : ancRelease[index - 1].time_created;
        branchTreeFilter.push({
            createdAt: { $lte: new Date(createdAt) },
            branch: ObjectId(anc_release.release_ref.id),
            isLocal: false,
        });
        return false;
    });
    return [
        {
            branch: ObjectId(release.id),
        },
        ...branchTreeFilter,
    ];
}

export const filterForRelease = (
    release,
    groupBy,
    searchFilters,
    pageFilters,
    historyTillBranchId? // When the agreesion creates the hirerichy then it can omit releases below this id.
) => {
    const filter = [
        {
            $match: {
                ...searchFilters,
                $or: getReleaseBranchFilter(release, historyTillBranchId),
            },
        },
        {
            $project: {
                [groupBy]: 1,
                updatedAt: 1,
                _id: 1,
                higherPref: { $cond: ['$isLocal', 1, 0] },
            },
        },
        { $sort: { higherPref: -1, updatedAt: -1 } },
        {
            $group: {
                _id: `$${groupBy}`,
                name: { $first: '$name' },
                id: { $first: '$_id' },
                updatedAt: { $first: '$updatedAt' },
            },
        },
        { $sort: { updatedAt: -1 } },
        { $limit: pageFilters.limit },
        { $skip: pageFilters.offset },
    ];
    return filter;
};
