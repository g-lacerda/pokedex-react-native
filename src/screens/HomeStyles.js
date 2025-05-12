import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#f95e5e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f95e5e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButtonText: {
    fontSize: 14,
    color: '#f95e5e',
    fontWeight: '600',
  },
  input: {
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    color: '#000',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#f95e5e',
  },
  modalSelectorWrapper: {
    marginBottom: 10,
  },
  modalSelector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#f95e5e',
    justifyContent: 'center',
    elevation: 2,
  },
  modalSelectorText: {
    color: '#333',
    fontSize: 14,
  },
  filterBox: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#444',
    textAlign: 'center',
  },
  clearFiltersButton: {
    marginTop: 10,
    backgroundColor: '#f95e5e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pokemonContainer: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  pokemonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    height: 140,
    borderRadius: 20,
    padding: 15,
    overflow: 'hidden',
  },
  img: {
    position: 'absolute',
    width: 90,
    height: 90,
    right: 10,
    bottom: 10,
    zIndex: 1,
  },
  backgroundImg: {
    position: 'absolute',
    width: 90,
    height: 90,
    right: -15,
    bottom: -15,
    zIndex: 0,
    opacity: 0.25,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: 'column',
  },
  typeStyle: {
    padding: 7,
    borderRadius: 10,
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255, 0.2)',
    color: '#eee',
    fontSize: 12,
  },
  textAndTypeContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  modalSelectorWrapper: {
    marginBottom: 12,
  },

  modalSelector: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  modalSelectorText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },

  modalSelectorOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },

  modalSelectorOptionText: {
    fontSize: 15,
    color: '#333',
  },

  modalSelectorSelected: {
    backgroundColor: '#f2f2f2',
  },

  modalSelectorCancel: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f95e5e',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  modalSelectorCancelText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  paperSelectButton: {
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },

  paperSelectButtonText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'left',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
